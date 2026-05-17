import { AuthUI } from "@/components/AuthUI";

export default function LoginPage() {
  return (
    <AuthUI 
      initialIsSignIn={true}
      signInContent={{
        quote: {
          text: "Welcome back to your Peblo AI workspace. Let's pick up where we left off.",
          author: "Peblo Intelligence"
        }
      }}
    />
  );
}
