import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        toast.success("Login successful!");
        navigate("/");
      } catch (err: unknown) {
        console.error("Login failed:", err);
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps("email")}
          className="mt-1 block w-full rounded-lg border border-black p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...formik.getFieldProps("password")}
          className="mt-1 block w-full rounded-lg border border-black p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.password}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#880090] hover:bg-[#7a0082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {formik.isSubmitting ? "Logging in..." : "Sign in"}
      </button>
    </form>
  );
};
