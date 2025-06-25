import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addProduct,
  removeProduct,
  updateQuantity,
  fetchCategories,
  clearError,
  addCustomProduct,
} from "@/store/productSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Plus, X, Loader2, AlertCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductSelection = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { availableProducts, selectedProducts, categories, isLoading, error } =
    useAppSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCustomProductForm, setShowCustomProductForm] = useState<
    string | null
  >(null);
  const [customProductName, setCustomProductName] = useState<string>("");
  const [customProductQuantity, setCustomProductQuantity] = useState<number>(1);

  // Fetch categories (which include products) on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Get categories for filter dropdown
  const categoryOptions = categories.map((cat) => cat.name);

  const filteredProducts =
    selectedCategory === "all"
      ? availableProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : availableProducts.filter(
          (product) =>
            product.category === selectedCategory &&
            product.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  const isProductSelected = (productId: string) => {
    return selectedProducts.some((product) => product.id === productId);
  };

  const getProductQuantity = (productId: string) => {
    const product = selectedProducts.find(
      (product) => product.id === productId,
    );
    return product ? product.quantity : 0;
  };

  const handleProductToggle = (product: any) => {
    if (isProductSelected(product.id)) {
      dispatch(removeProduct(product.id));
    } else {
      dispatch(addProduct(product));
    }
  };

  const handleAddCustomProduct = (categoryName: string) => {
    if (customProductName.trim() && customProductQuantity > 0) {
      const customProduct = {
        id: `custom-${Date.now()}`,
        name: customProductName.trim(),
        category: categoryName,
        price: 0, // Custom products have no price initially
        description: "מוצר מותאם אישית",
        isCustom: true,
      };

      dispatch(
        addCustomProduct({ ...customProduct, quantity: customProductQuantity }),
      );

      // Reset form
      setCustomProductName("");
      setCustomProductQuantity(1);
      setShowCustomProductForm(null);
    }
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce(
      (total, product) => total + (product.price || 0) * product.quantity,
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

  const proceedToOrderSummary = () => {
    if (selectedProducts.length > 0) {
      navigate("/order-summary");
    }
  };

  // Show loading state
  if (isLoading && availableProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">טוען מוצרים...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && availableProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(fetchCategories());
                }}
              >
                נסה שוב
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">בחר מוצרים</h1>
          <p className="text-gray-600 text-lg">בחר את המוצרים שברצונך להזמין</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => dispatch(clearError())}
              >
                סגור
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters Section */}
        <div
          dir="rtl"
          className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Category Filter */}
          <Select
            dir="rtl"
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="סנן לפי קטגוריה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הקטגוריות</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Filter */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              dir="rtl"
              placeholder="חיפוש מוצרים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading indicator for products */}
        {isLoading && (
          <div className="text-center mb-6">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            <p className="text-gray-600 mt-2">טוען מוצרים...</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 items-start">
          {/* Custom Product Card for selected category only */}
          {selectedCategory !== "all" && (
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg border-dashed border-2 border-gray-300 hover:border-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-center">
                  <Badge variant="secondary" className="text-xs">
                    {selectedCategory}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-center">
                  הוסף מוצר מותאם
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showCustomProductForm === selectedCategory ? (
                  <div className="space-y-3" dir="rtl">
                    <Input
                      placeholder="שם המוצר"
                      value={customProductName}
                      onChange={(e) => setCustomProductName(e.target.value)}
                      className="text-right"
                    />
                    <div className="flex items-center gap-2">
                      <span dir="rtl" className="text-sm text-gray-600">
                        כמות:
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setCustomProductQuantity(
                            Math.max(1, customProductQuantity - 1),
                          )
                        }
                      >
                        -
                      </Button>
                      <span className="min-w-[2rem] text-center font-semibold">
                        {customProductQuantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setCustomProductQuantity(customProductQuantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddCustomProduct(selectedCategory)}
                        className="flex-1"
                      >
                        הוסף
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowCustomProductForm(null);
                          setCustomProductName("");
                          setCustomProductQuantity(1);
                        }}
                      >
                        ביטול
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCustomProductForm(selectedCategory)}
                      className="w-full"
                    >
                      הוסף מוצר מותאם
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Regular Products */}
          {filteredProducts.map((product) => {
            const selected = isProductSelected(product.id);
            return (
              <Card
                key={product.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  selected && "ring-2 ring-primary bg-primary/5",
                )}
                onClick={() => handleProductToggle(product)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        selected
                          ? "bg-primary border-primary"
                          : "border-gray-300",
                      )}
                    >
                      {selected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-right">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-right mb-3">
                    {product.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {product.isCustom ? "₪0" : `₪${product.price}`}
                    </span>
                    {selected ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentQuantity = getProductQuantity(
                              product.id,
                            );
                            dispatch(
                              updateQuantity({
                                id: product.id,
                                quantity: currentQuantity - 1,
                              }),
                            );
                          }}
                        >
                          -
                        </Button>
                        <span className="min-w-[2rem] text-center font-semibold">
                          {getProductQuantity(product.id)}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(addProduct(product));
                          }}
                        >
                          +
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(addProduct(product));
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        הוסף
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No products message */}
        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedCategory === "all"
                ? "אין מוצרים זמינים כרגע"
                : `אין מוצרים בקטגוריה "${selectedCategory}"`}
            </p>
          </div>
        )}

        {/* Selected Products Summary */}
        {selectedProducts.length > 0 && (
          <Card
            className="mb-6 w-full max-w-full md:max-w-md md:w-[400px] mx-auto"
            dir="rtl"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>מוצרים נבחרים</span>
                <Badge variant="secondary">
                  {selectedProducts.length} מוצרים
                </Badge>
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
                      <div className="space-y-2">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="flex justify-between items-center py-2"
                          >
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  dispatch(removeProduct(product.id))
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              <span className="text-gray-500">
                                x{product.quantity}
                              </span>
                              <span className="font-medium">
                                {product.name}
                              </span>
                            </div>
                            <span className="text-primary font-semibold">
                              ₪{(product.price || 0) * product.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">סה"כ</span>
                    <span className="text-2xl font-bold text-primary">
                      ₪{getTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proceed Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={proceedToOrderSummary}
            disabled={selectedProducts.length === 0}
            className="px-8"
          >
            המשך להזמנה
            <span className="mr-2">({selectedProducts.length} מוצרים)</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;
