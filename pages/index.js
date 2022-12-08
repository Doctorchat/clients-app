import React from "react";
import { useRouter } from "next/router";

import AuthWrapper from "@/containers/AuthWrapper";

function Home() {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/home");
  }, [router]);

  return null;
}

Home.getLayout = (page) => <AuthWrapper>{page}</AuthWrapper>;

export default Home;
