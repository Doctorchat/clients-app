import Link from "next/link";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/services/validation";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import { loginUser } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";

export default function Login() {
  const resolver = useYupValidationResolver(loginSchema);
  const [loading, setLoading] = useState(false);
  const form = useForm({ resolver });
  const router = useRouter();
  const dispatch = useDispatch();

  const onLoginSubmit = useCallback(
    async (values) => {
      dispatch(notification({ title: "Success", descrp: "Ceva success message" }));
      try {
        setLoading(true);
        await dispatch(loginUser(values));

        if (router.query.redirect) {
          router.push(router.query.redirect);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, router]
  );

  return (
    <>
      <div className="auth-header">
        <div className="auth-header-logo">
          <h3 className="m-0">DoctorChat</h3>
        </div>
        <Link href="/auth/register">
          <a>
            <Button type="outline">Înregistrare</Button>
          </a>
        </Link>
      </div>
      <div className="auth-form">
        <Form name="login-form" methods={form} onFinish={onLoginSubmit}>
          <p className="form-subtitle">DoctorChat</p>
          <h3 className="form-title">Forma de autentificare</h3>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Parola" name="password">
            <Input type="password" />
          </Form.Item>
          <div className="form-bottom">
            <Button htmlType="submit" loading={loading}>
              Autentificare
            </Button>
            <Link href="/auth/restore">Ai uitat parola?</Link>
          </div>
        </Form>
      </div>
    </>
  );
}

Login.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};
