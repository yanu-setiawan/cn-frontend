import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import LoaderPage from "@/components/Loader";

describe("<LoaderPage />", () => {
  it("render tanpa crash dan menampilkan teks loading", () => {
    render(<LoaderPage />);

    expect(screen.getByText("Loading ...")).toBeInTheDocument();
  });

  it("merender 12 bar animasi", () => {
    const { container } = render(<LoaderPage />);

    expect(container.querySelectorAll(".loading-bars > span")).toHaveLength(12);
  });

  it("memberi animation-delay bertahap 0.1s per bar", () => {
    const { container } = render(<LoaderPage />);
    const bars = container.querySelectorAll<HTMLSpanElement>(".loading-bars > span");

    expect(bars[0].style.animationDelay).toBe("0s");
    expect(bars[1].style.animationDelay).toBe("0.1s");
    expect(bars[11].style.animationDelay).toBe("1.1s");
  });
});
