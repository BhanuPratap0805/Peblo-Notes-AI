import { AuthUI } from "@/components/AuthUI";

export default function SignupPage() {
  return (
    <AuthUI 
      initialIsSignIn={false}
      signUpContent={{
        quote: {
          text: "Start your journey into a smarter, faster, and more integrated workspace today.",
          author: "Peblo Intelligence"
        }
      }}
    />
  );
}
