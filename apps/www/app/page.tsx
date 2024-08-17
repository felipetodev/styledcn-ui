"use client"
import { Badge } from "@/registry/default/ui/badge";
import { Button, buttonVariants, StyledButton } from "@/registry/default/ui/button";
import { Input } from "@/registry/default/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/registry/default/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/default/ui/alert-dialog";

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
          CSS framework agnostic
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
        <Button variant="outline">
          Outline
        </Button>
        <StyledButton className={buttonVariants()}>
          Button with Variants
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
        <Badge variant="outline">
          Outline
        </Badge>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <small style={{ opacity: 0.8 }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt magni et similique, fugiat nihil ex sapiente exercitationem qui facilis mollitia commodi, necessitatibus voluptatem. Nemo quos excepturi ex minima delectus culpa?
            </small>

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Alert Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div style={{ display: "grid", gap: "10px", maxWidth: "20rem" }}>
        <Input type="email" placeholder="Email" />
        <Input type="file" />
      </div>
    </main>
  );
}
