import type { LocalizationResource } from "@clerk/shared/types";

// Override Clerk's default English strings so the UI says
// "Login"/"Register"/"Logout" instead of "Sign in"/"Sign up"/"Sign out".
export const clerkLocalization: LocalizationResource = {
  signIn: {
    start: {
      title: "Login to {{applicationName}}",
      subtitle: "Welcome back! Please login to continue",
      actionText: "Don’t have an account?",
      actionLink: "Register",
      titleCombined: "Continue to {{applicationName}}",
    },
    password: {
      actionLink: "Use another method",
    },
  },
  signUp: {
    start: {
      title: "Register for {{applicationName}}",
      subtitle: "Welcome! Please fill in the details to get started.",
      actionText: "Already have an account?",
      actionLink: "Login",
    },
    continue: {
      actionText: "Already have an account?",
      actionLink: "Login",
    },
    restrictedAccess: {
      actionText: "Already have an account?",
      actionLink: "Login",
      title: "Access restricted",
      subtitle:
        "Registration is currently disabled. If you believe you should have access, please contact support.",
    },
  },
  userButton: {
    action__signOut: "Logout",
    action__signOutAll: "Logout of all accounts",
  },
  signInEnterPasswordTitle: "Enter your password",
  formButtonPrimary: "Continue",
};
