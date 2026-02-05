"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Controller, type Control } from "react-hook-form";

type DatePickerProps = {
  control: Control<any>;
  name: string;
};

export function DatePicker({ control, name }: DatePickerProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field className="mx-auto w-44">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id={name}
                className="justify-start font-normal w-full cursor-pointer"
              >
                {field.value ? (
                  format(field.value, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                defaultMonth={field.value}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </Field>
      )}
    />
  );
}
