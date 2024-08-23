import { Field, ErrorMessage } from "formik";

interface FormFieldProps {
  textLabel: string;
  fieldName: string;
  fieldPlaceholder: string;
  errorComponent: string;
}

const FormField: React.FC<FormFieldProps> = ({ ...props }) => {
  return (
    <div className="flex flex-col w-2/5 gap-y-1.5 justify-start">
      <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {props.textLabel}
      </p>
      {props.fieldName === "email" && (
        <Field
          name="email"
          type="email"
          placeholder={props.fieldPlaceholder}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      )}
      {props.fieldName === "password" && (
        <Field
          name="password"
          type="password"
          placeholder={props.fieldPlaceholder}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      )}
      {props.fieldName !== "email" && props.fieldName !== "password" && (
        <Field
          name={props.fieldName}
          type="text"
          placeholder={props.fieldPlaceholder}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      )}
      <ErrorMessage
        className="text-red-600 h-auto text-wrap"
        name={props.fieldName}
        component={props.errorComponent}
      />
    </div>
  );
};

export default FormField;
