import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const signUpSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(/@aston\.ac\.uk$/, "Email must end with @aston.ac.uk")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
  course: Yup.string().required("Please select your course"),
  otherCourse: Yup.string().when("course", ([course], schema) => {
    return course === "Other"
      ? schema.required("Please specify your course")
      : schema;
  }),
});

export const SignUpForm: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      course: "",
      otherCourse: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      try {
        const fullName = `${values.firstName} ${values.lastName}`;
        await signup(fullName, values.email, values.password);
        toast.success("Sign-up successful!");
        navigate("/"); // Redirect after successful sign-up
      } catch (err: unknown) {
        console.error("Sign-up failed:", err);
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
      {/* First Name */}
      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-gray-700"
        >
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          {...formik.getFieldProps("firstName")}
          className="mt-1 block w-full rounded-lg border border-black p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.firstName}
          </div>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-gray-700"
        >
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          {...formik.getFieldProps("lastName")}
          className="mt-1 block w-full rounded-lg border border-black p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.lastName}
          </div>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
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

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...formik.getFieldProps("confirmPassword")}
          className="mt-1 block w-full rounded-lg border border-black p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.confirmPassword}
          </div>
        )}
      </div>

      {/* Course Dropdown */}
      <div>
        <label
          htmlFor="course"
          className="block text-sm font-medium text-gray-700"
        >
          Select Your Course
        </label>
        <select
          id="course"
          {...formik.getFieldProps("course")}
          onChange={(e) => {
            formik.handleChange(e);
            setSelectedCourse(e.target.value);
          }}
          className="mt-1 block w-full rounded-lg border border-black p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a course</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Computer Science with Business">
            Computer Science with Business
          </option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Other">Other, please specify</option>
        </select>
        {formik.touched.course && formik.errors.course && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.course}</div>
        )}
      </div>

      {/* Other Course Input */}
      {selectedCourse === "Other" && (
        <div>
          <label
            htmlFor="otherCourse"
            className="block text-sm font-medium text-gray-700"
          >
            Specify Your Course
          </label>
          <input
            id="otherCourse"
            type="text"
            {...formik.getFieldProps("otherCourse")}
            className="mt-1 block w-full rounded-lg border border-black p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {formik.touched.otherCourse && formik.errors.otherCourse && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.otherCourse}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#880090] hover:bg-[#7a0082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {formik.isSubmitting ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
};