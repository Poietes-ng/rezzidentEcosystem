import { Redirect } from 'expo-router';

/** Root entry — always boots into the splash/onboarding stack first. */
export default function Index() {
  return <Redirect href="/(application)/splash" />;
}
