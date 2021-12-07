import { useForm } from "react-hook-form";
import Link from "next/link";
import { registerSchema } from "@/services/validation";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import Button from "@/components/Button";

export default function Register() {
  const resolver = useYupValidationResolver(registerSchema);
  const form = useForm({ resolver });

  return (
    <>
      <div className="auth-header">
        <div className="auth-header-logo">
          <h3 className="m-0">DoctorChat</h3>
        </div>
        <Link href="/auth/login">
          <a>
            <Button type="outline">Autentificare</Button>
          </a>
        </Link>
      </div>
      <div className="auth-form">
        <Form name="login-form" methods={form}>
          <p className="form-subtitle">DoctorChat</p>
          <h3 className="form-title">Forma de înregistrare</h3>
          <Form.Item label="Email*" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Nr. Telefon" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Prenume*" name="firstName">
            <Input />
          </Form.Item>
          <Form.Item label="Nume*" name="lastName">
            <Input />
          </Form.Item>
          <Form.Item label="Parola*" name="password">
            <Input />
          </Form.Item>
          <Form.Item label="Repetă parola*" name="passwordConfirmation">
            <Input />
          </Form.Item>
          <div className="form-bottom">
            <Button htmlType="submit">Înregistre</Button>
            <Link href="/auth/login">
              <a>Deja ai cont?</a>
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
}

Register.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};
