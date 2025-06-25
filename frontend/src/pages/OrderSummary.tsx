import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateUserDetails,
  submitOrder,
  clearSubmitStatus,
  UserDetails,
} from "@/store/orderSlice";
import { clearSelectedProducts, removeProduct } from "@/store/productSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  ShoppingCart,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  firstName: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה"),
});

type FormData = z.infer<typeof formSchema>;

const OrderSummary = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProducts } = useAppSelector((state) => state.products);
  const { userDetails, isSubmitting, submitSuccess, submitError } =
    useAppSelector((state) => state.order);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
    },
  });

  // Redirect if no products selected
  useEffect(() => {
    if (selectedProducts.length === 0) {
      navigate("/");
    }
  }, [selectedProducts, navigate]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    console.log("📝 Form data received:", data);
    console.log("🛒 Selected products:", selectedProducts);

    // Validate data before sending
    console.log("🔍 Data validation check:");
    console.log("  - firstName:", typeof data.firstName, data.firstName);
    console.log("  - lastName:", typeof data.lastName, data.lastName);
    console.log("  - email:", typeof data.email, data.email);
    console.log("  - selectedProducts length:", selectedProducts.length);

    selectedProducts.forEach((product, index) => {
      console.log(`  - Product ${index + 1}:`, {
        id: typeof product.id,
        idValue: product.id,
        name: typeof product.name,
        nameValue: product.name,
        category: typeof product.category,
        categoryValue: product.category,
        price: typeof product.price,
        priceValue: product.price,
        quantity: typeof product.quantity,
        quantityValue: product.quantity,
        description: typeof product.description,
        descriptionValue: product.description,
      });
    });

    dispatch(updateUserDetails(data as any));

    try {
      const orderData = {
        userDetails: data as any,
        selectedProducts,
      };

      console.log(
        "📤 Submitting order data:",
        JSON.stringify(orderData, null, 2),
      );

      await dispatch(submitOrder(orderData)).unwrap();

      toast.success("ההזמנה נשלחה בהצלחה!");

      // Clear form and selected products after successful submission
      setTimeout(() => {
        dispatch(clearSelectedProducts());
        dispatch(clearSubmitStatus());
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("❌ Order submission error:", error);
      toast.error("שגיאה בשליחת ההזמנה. אנא נסה שוב.");
    }
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
  };

  const getProductsByCategory = () => {
    const categories: { [key: string]: typeof selectedProducts } = {};
    selectedProducts.forEach((product) => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });
    return categories;
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-700">
              ההזמנה נשלחה בהצלחה!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600 mb-4">
              תודה לך על ההזמנה. נציג יצור איתך קשר בקרוב.
            </CardDescription>
            <p className="text-sm text-gray-500">
              חוזר לעמוד הראשי בעוד כמה שניות...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">סיכום הזמנה</h1>
          <p className="text-gray-600 text-lg">מלא את הפרטים להשלמת ההזמנה</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card
            dir="rtl"
            className="w-full max-w-full lg:max-w-md lg:w-[400px] self-start"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                סיכום המוצרים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(getProductsByCategory()).map(
                  ([category, products]) => (
                    <div key={category}>
                      <Badge variant="secondary" className="mb-2">
                        {category}
                      </Badge>
                      <div className="space-y-2 mb-4">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between py-2 w-full"
                          >
                            <div className="flex items-center gap-2 mr-4">
                              <button
                                type="button"
                                className="text-gray-400 hover:text-red-500 text-lg"
                                onClick={() =>
                                  dispatch(removeProduct(product.id))
                                }
                                aria-label="הסר מוצר"
                              >
                                ×
                              </button>
                              <span className="text-gray-500 text-sm">
                                x{product.quantity}
                              </span>
                              <span className="font-bold text-right flex-1">
                                {product.name}
                              </span>
                            </div>

                            <span className="text-primary font-semibold min-w-[3.5rem] text-left">
                              ₪{(product.price || 0) * product.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}

                <Separator />

                <div className="flex justify-between items-center pt-4 w-full">
                  <span className="text-xl font-bold text-right">
                    סה"כ לתשלום:
                  </span>
                  <span className="text-2xl font-bold text-primary text-left min-w-[3.5rem] flex-shrink-0">
                    ₪{getTotalPrice()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Details Form */}
          <Card dir="rtl" className="self-start">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                פרטים אישיים
              </CardTitle>
              <CardDescription>מלא את הפרטים שלך להשלמת ההזמנה</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם פרטי</FormLabel>
                        <FormControl>
                          <Input placeholder="הכנס שם פרטי" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם משפחה</FormLabel>
                        <FormControl>
                          <Input placeholder="הכנס שם משפחה" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>כתובת אימייל</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="הכנס כתובת אימייל"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {submitError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="flex-1"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      חזור למוצרים
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          שולח...
                        </>
                      ) : (
                        "אשר הזמנה"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
