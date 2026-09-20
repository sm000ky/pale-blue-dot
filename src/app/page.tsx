import PaleBlueDot from '@/components/PaleBlueDot'

/**
 * Server Component. The whole piece is one locked, interactive screen, so this
 * route exists only to hand off to the client boundary; metadata lives in the
 * root layout.
 */
export default function Page() {
  return <PaleBlueDot />
}
