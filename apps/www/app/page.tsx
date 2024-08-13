"use client"
import { Badge } from "@/registry/default/ui/badge";
import { Button, buttonVariants, StyledButton } from "@/registry/default/ui/button";

export default function Home() {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1>
          styledcn/ui - CSS in JS shadcn based ✨
        </h1>
        <small style={{ opacity: 0.6 }}>
          (framework agnostic)
        </small>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <Button variant="default">
          Primary
        </Button>
        <Button variant="secondary">
          Secondary
        </Button>
        <Button variant="destructive">
          Destructive
        </Button>
        <StyledButton className={buttonVariants()}>
          Link with Variants
        </StyledButton>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <Badge>
          Primary
        </Badge>
        <Badge variant="secondary">
          Secondary
        </Badge>
        <Badge variant="destructive">
          Destructive
        </Badge>
      </div>
    </main>
  );
}
