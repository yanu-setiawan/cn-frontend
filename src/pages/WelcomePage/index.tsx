import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden bg-white text-primary">
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-150 w-150 rounded-full bg-primary/50 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-30%] left-[10%] h-100 w-100 rounded-full bg-primary/25 blur-[100px]" />

      <div className="relative z-10 flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-6 text-center gap-10">
        <h1 className="text-5xl font-light uppercase tracking-[0.2em] sm:text-6xl md:text-7xl">
          Welcome
        </h1>

        <Button
          radius="full"
          size="lg"
          endContent={<ArrowRight size={16} />}
          onPress={() => navigate("/monitoring")}
          color="primary"
        >
          Buka Monitoring
        </Button>
      </div>
    </section>
  );
};

export default WelcomePage;
