/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Flex, Box, TextField, Text } from "@radix-ui/themes";

interface InputProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  fieldType: any;
  placeholder: string;
  maxValue?: number;
  minValue?: number;
}

const InputField: React.FC<InputProps> = ({ ...props }) => {
  return (
    <>
      <Flex className="items-center" direction="column" gap="5" align="center">
        <Box maxWidth="300px">
          <Text as="p" size="5" className="text-white text-center">
            {props.label}
          </Text>
          <TextField.Root
            size="3"
            placeholder={props.placeholder}
            onChange={props.onChange}
            name={props.name}
            type={props.fieldType}
            max={props.maxValue}
            min={props.minValue}
          />
        </Box>
      </Flex>
    </>
  );
};

export default InputField;
