"use client";

import * as React from "react";
import { type Control, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";

type DatePickerTimeProps = {
  control: Control<any>;
  dateName: string;
  timeName: string;
  labelDate?: string;
  labelTime?: string;
};

export function DatePickerTime({
  control,
  dateName,
  timeName,
  labelDate = "Data",
  labelTime = "Hora",
}: DatePickerTimeProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FieldGroup className="mx-auto max-w-xs flex-row">
      {/* DATE */}
      <Field>
        <FieldLabel>{labelDate}</FieldLabel>

        <Controller
          control={control}
          name={dateName}
          render={({ field }) => (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-32 justify-between font-normal cursor-pointer"
                >
                  {field.value
                    ? format(field.value, "PPP", { locale: ptBR })
                    : "Selecionar data"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={field.value}
                  defaultMonth={field.value}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    field.onChange(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </Field>

      {/* TIME */}
      <Field className="w-32">
        <FieldLabel>{labelTime}</FieldLabel>

        <Controller
          control={control}
          name={timeName}
          render={({ field }) => (
            <Input
              {...field}
              type="time"
              step="1"
              className="bg-background appearance-none
                [&::-webkit-calendar-picker-indicator]:hidden
                [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          )}
        />
      </Field>
    </FieldGroup>
  );
}
