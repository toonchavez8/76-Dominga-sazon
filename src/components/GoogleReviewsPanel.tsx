"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ReviewAuthor = {
  displayName?: string;
  uri?: string;
  photoURI?: string;
};

type PlaceReview = {
  rating?: number;
  text?: string;
  relativePublishTimeDescription?: string;
  publishTime?: string | Date;
  authorAttribution?: ReviewAuthor;
};

type PlaceDetails = {
  displayName?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsURI?: string;
  reviews?: PlaceReview[];
};

type ReviewsPanelProps = {
  mapsApiKey?: string;
  placeId?: string;
  mapsUrl: string;
  placeName: string;
};

type GoogleMapsWindow = Window & typeof globalThis & { google?: GoogleMapsApi };

type GoogleMapsApi = {
  maps: {
    importLibrary: (name: "places") => Promise<PlacesLibrary>;
  };
};

type PlacesLibrary = {
  Place: new (options: { id: string }) => PlaceInstance;
};

type PlaceInstance = PlaceDetails & {
  fetchFields: (options: { fields: string[] }) => Promise<void>;
};

const MAX_REVIEWS = 20;
const AUTO_SCROLL_STEP = 0.35;

let mapsLoaderPromise: Promise<GoogleMapsApi> | null = null;

function loadPlacesLibrary(apiKey: string) {
  if (mapsLoaderPromise) {
    return mapsLoaderPromise;
  }

  mapsLoaderPromise = new Promise((resolve, reject) => {
    const existingMaps = (window as GoogleMapsWindow).google?.maps;
    if (existingMaps?.importLibrary) {
      resolve((window as GoogleMapsWindow).google as GoogleMapsApi);
      return;
    }

    ((params: Record<string, string>) => {
      const productName = "The Google Maps JavaScript API";
      const namespace = "google";
      const importLibraryName = "importLibrary";
      const callbackName = "__ib__";
      const doc = document;
      const win = window as GoogleMapsWindow;
      let bootstrapPromise: Promise<void> | undefined;
      const requestedLibraries = new Set<string>();
      const queryParams = new URLSearchParams();
      let googleNamespace = (
        win as GoogleMapsWindow & {
          google?: GoogleMapsApi;
        }
      ).google;
      if (!googleNamespace) {
        googleNamespace = {} as GoogleMapsApi;
        (win as GoogleMapsWindow & { google?: GoogleMapsApi }).google =
          googleNamespace;
      }
      let mapsNamespace = googleNamespace.maps;
      if (!mapsNamespace) {
        mapsNamespace = {} as GoogleMapsApi["maps"];
        googleNamespace.maps = mapsNamespace;
      }

      const ensureScript = () => {
        if (bootstrapPromise) {
          return bootstrapPromise;
        }

        bootstrapPromise = new Promise<void>((resolveScript, rejectScript) => {
          const script = doc.createElement("script");
          queryParams.set("libraries", [...requestedLibraries].join(","));
          for (const [key, value] of Object.entries(params)) {
            queryParams.set(
              key.replace(/[A-Z]/g, (token) => `_${token[0].toLowerCase()}`),
              value,
            );
          }
          queryParams.set("callback", `${namespace}.maps.${callbackName}`);
          script.src = `https://maps.googleapis.com/maps/api/js?${queryParams}`;
          (
            mapsNamespace as GoogleMapsApi["maps"] & {
              [callbackName]: () => void;
            }
          )[callbackName] = resolveScript;
          script.onerror = () =>
            rejectScript(new Error(`${productName} no se pudo cargar.`));
          doc.head.append(script);
        });

        return bootstrapPromise;
      };

      if (!mapsNamespace.importLibrary) {
        mapsNamespace[importLibraryName] = ((library: string) => {
          requestedLibraries.add(library);
          return ensureScript().then(() => {
            const loadedMaps = (window as GoogleMapsWindow).google?.maps;
            if (!loadedMaps?.importLibrary) {
              throw new Error("Google Maps no expuso importLibrary.");
            }
            return loadedMaps.importLibrary(library as "places");
          });
        }) as GoogleMapsApi["maps"]["importLibrary"];
      }
    })({
      key: apiKey,
      v: "weekly",
      language: "es-MX",
      region: "MX",
    });

    const maps = (window as GoogleMapsWindow).google?.maps;
    if (!maps?.importLibrary) {
      reject(new Error("Google Maps no expuso importLibrary."));
      return;
    }

    resolve((window as GoogleMapsWindow).google as GoogleMapsApi);
  });

  return mapsLoaderPromise;
}

function formatPublishTime(value?: string | Date) {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function renderStars(rating = 0) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

function getReviewKey(review: PlaceReview, index = 0) {
  return [
    review.authorAttribution?.displayName ?? "google-review",
    review.publishTime instanceof Date
      ? review.publishTime.toISOString()
      : (review.publishTime ?? ""),
    review.relativePublishTimeDescription ?? "",
    index,
  ].join("-");
}

export default function GoogleReviewsPanel({
  mapsApiKey,
  placeId,
  mapsUrl,
  placeName,
}: ReviewsPanelProps) {
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(mapsApiKey && placeId));
  const railRef = useRef<HTMLDivElement | null>(null);
  const pauseAutoScrollRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      reducedMotionRef.current = media.matches;
    };

    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      if (!mapsApiKey || !placeId) {
        setIsLoading(false);
        return;
      }

      try {
        const googleMaps = await loadPlacesLibrary(mapsApiKey);
        const { Place } = await googleMaps.maps.importLibrary("places");
        const place = new Place({ id: placeId });
        await place.fetchFields({
          fields: [
            "displayName",
            "googleMapsURI",
            "rating",
            "reviews",
            "userRatingCount",
          ],
        });

        if (!cancelled) {
          setDetails({
            displayName: place.displayName,
            googleMapsURI: place.googleMapsURI,
            rating: place.rating,
            reviews: place.reviews,
            userRatingCount: place.userRatingCount,
          });
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No fue posible cargar las reseñas de Google.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [mapsApiKey, placeId]);

  const reviews = useMemo(
    () => (details?.reviews ?? []).slice(0, MAX_REVIEWS),
    [details?.reviews],
  );
  const loopedReviews = useMemo(
    () => [...reviews, ...reviews, ...reviews],
    [reviews],
  );
  const sourceUrl = details?.googleMapsURI ?? mapsUrl;
  const hasReviews = reviews.length > 0;
  const canShowFeed = !isLoading && hasReviews;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !hasReviews) {
      return;
    }

    const segmentWidth = rail.scrollWidth / 3;
    rail.scrollLeft = segmentWidth;
  }, [hasReviews]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !hasReviews) {
      return;
    }

    let frameId = 0;

    const tick = () => {
      const segmentWidth = rail.scrollWidth / 3;
      if (
        !draggingRef.current &&
        !pauseAutoScrollRef.current &&
        !reducedMotionRef.current
      ) {
        rail.scrollLeft += AUTO_SCROLL_STEP;
      }

      if (rail.scrollLeft >= segmentWidth * 2) {
        rail.scrollLeft -= segmentWidth;
      } else if (rail.scrollLeft <= 0) {
        rail.scrollLeft += segmentWidth;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [hasReviews]);

  function scrollByCard(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const firstCard = rail.querySelector<HTMLElement>("[data-review-card]");
    const step = firstCard ? firstCard.offsetWidth + 24 : 360;
    rail.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    draggingRef.current = true;
    pauseAutoScrollRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = rail.scrollLeft;
    rail.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail || !draggingRef.current) {
      return;
    }

    const delta = event.clientX - dragStartXRef.current;
    rail.scrollLeft = dragStartScrollLeftRef.current - delta;
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    draggingRef.current = false;
    pauseAutoScrollRef.current = false;
    rail.releasePointerCapture(event.pointerId);
  }

  return (
    <section
      id="reseñas"
      className="py-24 sm:py-32"
      style={{ background: "var(--color-dominia-paper)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-dominia-warm-gray)" }}
            >
              Reseñas de Google
            </p>
            <h2 className="mb-4">Lo que dicen quienes ya vinieron</h2>
            <p className="text-base leading-relaxed text-dominia-slate">
              Gracias a quienes visitan {placeName}, vuelven y comparten su buen
              paladar. Estas reseñas reales nos recuerdan que cada fin de semana
              vale la pena encender la cocina.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:justify-end">
            {details?.rating ? (
              <div
                className="rounded-full px-4 py-2 text-sm"
                style={{
                  background: "var(--color-dominia-warm-white)",
                  color: "var(--color-dominia-slate)",
                  border: "1px solid var(--color-dominia-border)",
                }}
              >
                <span
                  className="mr-2 font-semibold"
                  style={{ color: "var(--color-dominia-ink)" }}
                >
                  {details.rating.toFixed(1)}
                </span>
                <span style={{ color: "var(--color-dominia-gold)" }}>
                  {renderStars(details.rating)}
                </span>
              </div>
            ) : null}

            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors"
              style={{
                background: "var(--color-dominia-terracotta)",
                color: "white",
              }}
            >
              Ver perfil en Google
            </a>
          </div>
        </div>

        {isLoading ? (
          <div
            className="flex min-h-80 items-center justify-center rounded-[28px] border border-dashed px-6 text-center text-sm"
            style={{
              borderColor: "var(--color-dominia-border)",
              background: "var(--color-dominia-warm-white)",
            }}
          >
            Cargando reseñas reales de Google...
          </div>
        ) : null}

        {!isLoading && !hasReviews ? (
          <div
            className="flex min-h-80 flex-col justify-between rounded-[28px] border border-dashed p-6 sm:p-8"
            style={{
              borderColor: "var(--color-dominia-border)",
              background: "var(--color-dominia-warm-white)",
            }}
          >
            <div>
              <p className="mb-3 text-lg font-semibold text-dominia-ink">
                El carrusel ya está listo para usar reseñas reales.
              </p>
              <p className="max-w-2xl text-sm leading-7 text-dominia-slate">
                Si sigues viendo este fallback después de poner las variables,
                revisa que la key tenga habilitadas `Maps JavaScript API` y
                `Places API`, además de las restricciones de dominio correctas.
              </p>
              {error ? (
                <p className="mt-4 text-sm" style={{ color: "#b45309" }}>
                  Detalle: {error}
                </p>
              ) : null}
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-fit items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white"
              style={{ background: "var(--color-dominia-terracotta)" }}
            >
              Abrir negocio en Google Maps
            </a>
          </div>
        ) : null}

        {canShowFeed ? (
          <div
            className="relative overflow-hidden rounded-4xl px-0"
            style={{ background: "var(--color-dominia-paper)" }}
          >
            <div className="absolute  flex w-full justify-between px-3 sm:px-4 z-50 h-full  items-center">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-lg"
                style={{
                  background: "rgba(253, 252, 250, 0.98)",
                  borderColor: "var(--color-dominia-border)",
                  color: "var(--color-dominia-ink)",
                  boxShadow: "0 14px 28px rgba(26, 24, 20, 0.12)",
                }}
                aria-label="Reseñas anteriores"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-lg"
                style={{
                  background: "rgba(253, 252, 250, 0.98)",
                  borderColor: "var(--color-dominia-border)",
                  color: "var(--color-dominia-ink)",
                  boxShadow: "0 14px 28px rgba(26, 24, 20, 0.12)",
                }}
                aria-label="Siguientes reseñas"
              >
                ›
              </button>
            </div>

            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-dominia-paper) 0%, rgba(250,247,242,0.94) 38%, rgba(250,247,242,0) 100%)",
              }}
            ></div>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20"
              style={{
                background:
                  "linear-gradient(270deg, var(--color-dominia-paper) 0%, rgba(250,247,242,0.94) 38%, rgba(250,247,242,0) 100%)",
              }}
            ></div>

            <fieldset
              ref={railRef}
              aria-label="Carrusel arrastrable de reseñas de Google"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onMouseEnter={() => {
                pauseAutoScrollRef.current = true;
              }}
              onMouseLeave={() => {
                pauseAutoScrollRef.current = false;
              }}
              onFocus={() => {
                pauseAutoScrollRef.current = true;
              }}
              onBlur={() => {
                pauseAutoScrollRef.current = false;
              }}
              className="m-0 flex min-w-0 cursor-grab gap-6 overflow-x-auto border-0 px-1 pb-4 pt-18 select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden sm:px-2 sm:pt-20"
            >
              {loopedReviews.map((review, index) => (
                <article
                  key={getReviewKey(review, index)}
                  data-review-card
                  className="flex h-[18rem] w-[18.5rem] shrink-0 flex-col justify-between rounded-[28px] border p-5 sm:h-[19rem] sm:w-[24rem] sm:p-6"
                  style={{
                    background: "var(--color-dominia-warm-white)",
                    borderColor: "rgba(224, 219, 213, 0.85)",
                    boxShadow: "0 18px 45px rgba(26, 24, 20, 0.05)",
                  }}
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div
                        className="text-sm tracking-[0.18em]"
                        style={{ color: "var(--color-dominia-gold)" }}
                      >
                        {renderStars(review.rating)}
                      </div>
                      <div className="text-xs text-dominia-warm-gray">
                        {review.relativePublishTimeDescription ??
                          formatPublishTime(review.publishTime)}
                      </div>
                    </div>

                    <p
                      className="text-sm leading-7 text-dominia-charcoal"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 6,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {review.text}
                    </p>
                  </div>

                  <a
                    href={review.authorAttribution?.uri ?? sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center gap-3"
                  >
                    {review.authorAttribution?.photoURI ? (
                      <img
                        src={review.authorAttribution.photoURI}
                        alt={review.authorAttribution.displayName ?? "Autor"}
                        className="h-11 w-11 rounded-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold"
                        style={{
                          background: "var(--color-dominia-terracotta-light)",
                          color: "var(--color-dominia-terracotta)",
                        }}
                      >
                        {review.authorAttribution?.displayName?.charAt(0) ??
                          "G"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-dominia-ink">
                        {review.authorAttribution?.displayName ??
                          "Autor en Google"}
                      </p>
                      <p className="text-xs text-dominia-warm-gray">
                        Reseña publicada en Google Maps
                      </p>
                    </div>
                  </a>
                </article>
              ))}
            </fieldset>
          </div>
        ) : null}
      </div>
    </section>
  );
}
