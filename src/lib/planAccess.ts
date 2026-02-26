export function getUserPlan(): string {
  try {
    const data = JSON.parse(localStorage.getItem("zapprobr_user") || "{}");
    return data.plan || "basic";
  } catch {
    return "basic";
  }
}

export const isPro = () => {
  const plan = getUserPlan();
  return plan === "pro" || plan === "premium";
};

export const isPremium = () => getUserPlan() === "premium";

export const isBasic = () => getUserPlan() === "basic";
