import SignupProgress from "@/components/SignupProgress";

export default function Signup() {
  return (
    <SignupProgress
      steps={[
        {
          name: "Account",
          status: true,
          link: "/account/profile",
        },
        {
          name: "Company",
          status: true,
          link: "/account/information",
        },
        {
          name: "Documents",
          status: false,
          link: "/account/information",
        },
      ]}
    />
  );
}

Signup.getLayout = function (page) {
  return <div>{page}</div>;
};
