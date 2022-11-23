import React from "react";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/home");
  }, [router]);

  return null;
}

export default Home;
