import { Formik, Form } from "formik";
import FormField from "../Input/FormField";
import React from "react";
import { Button } from "@mui/material";
import { Flex } from "@radix-ui/themes";

interface FieldProps {
  textLabel: string;
  fieldName: string;
  fieldPlaceholder: string;
  errorComponent: string;
}

interface FormProps {
  fields: FieldProps[];
  onSubmit: (value: any) => void;
  initValues: any;
  validation?: any;
  btnName: string;
}

const Forms: React.FC<FormProps> = ({ ...props }) => {
  return (
    <Flex justify="center" className="mt-12 w-full h-full">
      <Formik
        initialValues={props.initValues}
        onSubmit={props.onSubmit}
        validationSchema={props.validation}
      >
        <Form className="flex flex-col items-center space-y-4 w-1/2 md:space-y-6">
          {props.fields.map((field, index) => (
            <FormField
              key={index}
              textLabel={field.textLabel}
              fieldName={field.fieldName}
              fieldPlaceholder={field.fieldPlaceholder}
              errorComponent={field.errorComponent}
            />
          ))}
          <div className="flex pt-5 space-x-5 justify-center">
            <Button
              variant="contained"
              size="large"
              color="success"
              type="submit"
            >
              {props.btnName}
            </Button>
          </div>
        </Form>
      </Formik>
    </Flex>
  );
};

export default Forms;
