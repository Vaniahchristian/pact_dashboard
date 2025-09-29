
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BanknoteIcon } from "lucide-react";

const paymentMethodSchema = z.object({
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  accountNumber: z.string().min(8, "Account number must be at least 8 characters"),
  bankName: z.string().min(2, "Bank name is required"),
  branch: z.string().optional(),
  swiftCode: z.string().optional(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  onSubmit: (values: PaymentMethodFormValues) => void;
  defaultValues?: Partial<PaymentMethodFormValues>;
  isSubmitting?: boolean;
}

export const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting = false,
}) => {
  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      accountName: defaultValues?.accountName || "",
      accountNumber: defaultValues?.accountNumber || "",
      bankName: defaultValues?.bankName || "",
      branch: defaultValues?.branch || "",
      swiftCode: defaultValues?.swiftCode || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123456789" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Bank of Khartoum" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Main Branch" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="swiftCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SWIFT/BIC Code (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="BKKH123" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          <BanknoteIcon className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save Payment Method"}
        </Button>
      </form>
    </Form>
  );
};
