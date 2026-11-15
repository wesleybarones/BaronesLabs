import { GoogleButton } from "@/components/GoogleButton";
import { safeNext } from "@/lib/safe-next";
import { Hearts } from "@/components/Hearts";

export default async function Entrar({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const { next, erro } = await searchParams;
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 text-center">
      <Hearts />
      <div className="surgir relative space-y-3">
        <p className="text-sm uppercase tracking-[.3em] text-suave">um lugar só nosso</p>
        <h1 className="texto-3d font-serif text-8xl font-semibold">Lane</h1>
        <p className="font-serif text-xl italic text-tinta/80">
          desde 30 de dezembro de 2014 <span className="coracao text-vinho">♥</span>
        </p>
      </div>
      <div className="surgir relative flex w-full justify-center [animation-delay:.3s]">
        <GoogleButton next={safeNext(next)} />
      </div>
      {erro && <p className="text-sm text-vinho">Não deu certo dessa vez. Tenta de novo?</p>}
      <p className="fixed bottom-6 text-xs text-suave">feito com amor por Wesley · Barones Labs</p>
    </main>
  );
}
