export type CarListItem = {
  id: string;
  url: string;
  source: string;
  title: string;
  subtitle: string;
  year: number | null;
  brand: string | null;
  model: string | null;
  bodyType: string | null;
  color: string | null;
  engine: string | null;
  mileage: number | null;
  transmission: string | null;
  price: number;
  location: string;
  image: string;
  featured: boolean;
};

export type CarsResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: CarListItem[];
};

export type CarDetailsResponse = {
  id: string;
  url: string;
  source: string;
  title: string;
  subtitle: string;
  price: number;
  priceText: string;
  location: string;
  year: number | null;
  make: string | null;
  model: string | null;
  mileage: number | null;
  vin: string | null;
  transmission: string | null;
  bodyType: string | null;
  color: string | null;
  engine: string | null;
  sellerName: string | null;
  sellerAddress: string | null;
  description: string;
  firstImage: string;
  images: string[];
  imageCount: number;
  specifications: Record<string, unknown>;
};

export type CarsQuery = {
  page: number;
  pageSize: number;
  minYear?: number | null;
  maxYear?: number | null;
  brand?: string | null;
  make?: string | null;
  model?: string | null;
  transmission?: string | null;
  bodyType?: string | null;
  color?: string | null;
  engine?: string | null;
  minMileage?: number | null;
  maxMileage?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  search?: string | null;
  sortBy?: string | null;
  seed?: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

function setIfDefined(params: URLSearchParams, key: string, value: unknown) {
  if (value === null || value === undefined) return;
  if (typeof value === "string" && value.trim() === "") return;
  params.set(key, String(value));
}

export async function fetchCars(q: CarsQuery): Promise<CarsResponse> {
  const params = new URLSearchParams();

  setIfDefined(params, "page", q.page);
  setIfDefined(params, "pageSize", q.pageSize);

  setIfDefined(params, "minYear", q.minYear);
  setIfDefined(params, "maxYear", q.maxYear);
  setIfDefined(params, "minPrice", q.minPrice);
  setIfDefined(params, "maxPrice", q.maxPrice);
  setIfDefined(params, "minMileage", q.minMileage);
  setIfDefined(params, "maxMileage", q.maxMileage);
  setIfDefined(params, "search", q.search);

  // UI uses `brand`; backend accepts `brand` or `make`
  setIfDefined(params, "brand", q.brand ?? q.make);
  setIfDefined(params, "model", q.model);
  setIfDefined(params, "transmission", q.transmission);
  setIfDefined(params, "bodyType", q.bodyType);
  setIfDefined(params, "color", q.color);
  setIfDefined(params, "engine", q.engine);
  setIfDefined(params, "sortBy", q.sortBy);
  setIfDefined(params, "seed", q.seed);

  const res = await fetch(`${API_BASE}/api/cars?${params.toString()}`, {
    headers: { Accept: "application/json" },
    credentials: "include"
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`fetchCars failed (${res.status}): ${text}`);
  }
  return (await res.json()) as CarsResponse;
}

export async function fetchCarById(id: string): Promise<CarDetailsResponse> {
  const res = await fetch(`${API_BASE}/api/cars/${encodeURIComponent(id)}`, {
    headers: { Accept: "application/json" },
    credentials: "include"
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`fetchCarById failed (${res.status}): ${text}`);
  }
  return (await res.json()) as CarDetailsResponse;
}

export type UserBasic = {
  id: string;
  name: string | null;
  email: string;
};

export type AnswerResponse = {
  id: string;
  content: string;
  votes: number;
  createdAt: string;
  user: UserBasic;
};

export type QuestionResponse = {
  id: string;
  content: string;
  votes: number;
  createdAt: string;
  user: UserBasic;
  answers: AnswerResponse[];
};

export type CommentResponse = {
  id: string;
  content: string;
  votes: number;
  createdAt: string;
  user: UserBasic;
  parentId: string | null;
  replies: CommentResponse[];
};

export async function fetchCarQA(carId: string): Promise<{ items: QuestionResponse[] }> {
  const res = await fetch(`${API_BASE}/api/cars/${encodeURIComponent(carId)}/qa`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch Q&A");
  return res.json();
}

export async function addCarQuestion(carId: string, content: string): Promise<QuestionResponse> {
  const res = await fetch(`${API_BASE}/api/cars/${encodeURIComponent(carId)}/qa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to add question");
  return res.json();
}

export async function addQuestionAnswer(questionId: string, content: string): Promise<AnswerResponse> {
  const res = await fetch(`${API_BASE}/api/qa/${encodeURIComponent(questionId)}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to add answer");
  return res.json();
}

export async function voteQuestion(id: string, direction: "up" | "down"): Promise<{ votes: number }> {
  const res = await fetch(`${API_BASE}/api/qa/${encodeURIComponent(id)}/vote`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to vote");
  return res.json();
}

export async function fetchCarComments(carId: string): Promise<{ items: CommentResponse[] }> {
  const res = await fetch(`${API_BASE}/api/cars/${encodeURIComponent(carId)}/comments`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function addCarComment(carId: string, content: string, parentId?: string | null): Promise<CommentResponse> {
  const res = await fetch(`${API_BASE}/api/cars/${encodeURIComponent(carId)}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, parentId }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function voteComment(id: string, direction: "up" | "down"): Promise<{ votes: number }> {
  const res = await fetch(`${API_BASE}/api/comments/${encodeURIComponent(id)}/vote`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to vote");
  return res.json();
}

export type InquiryData = {
  listingId?: string | null;
  type: "AVAILABILITY" | "CALL" | "EMAIL" | "GENERAL" | "DETAILS";
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  zipCode?: string | null;
  country?: string | null;
  countryCode?: string | null;
  message?: string | null;
  listingUrl?: string | null;
};

export async function submitInquiry(data: InquiryData): Promise<{ ok: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`submitInquiry failed (${res.status}): ${text}`);
  }
  return res.json();
}

export type ShippingQuoteData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  destination: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  message?: string | null;
};

export async function submitShippingQuote(data: ShippingQuoteData): Promise<{ ok: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/api/shipping-quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to submit shipping quote");
  return res.json();
}

export async function getShippingQuote(id: string): Promise<ShippingQuoteData & { id: string, status: string, quoteAmount?: string }> {
  const res = await fetch(`${API_BASE}/api/shipping-quotes/${id}`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch shipping quote");
  return res.json();
}

export async function replyShippingQuote(id: string, amount: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/shipping-quotes/${id}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to send quote reply");
  return res.json();
}

export type VehicleInspectionData = {
  sellerName: string;
  listingUrl: string;
  sellerPhone: string;
  vin: string;
  make: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  country: string;
  phone: string;
};

export async function submitVehicleInspection(data: VehicleInspectionData, paymentProof: File): Promise<{ ok: boolean; id: string }> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  formData.append("paymentProof", paymentProof);

  const res = await fetch(`${API_BASE}/api/vehicle-inspections`, {
    method: "POST",
    body: formData,
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to submit vehicle inspection request");
  return res.json();
}

export async function getVehicleInspection(id: string): Promise<VehicleInspectionData & { id: string, status: string, reportUrl?: string, paymentProofUrl?: string }> {
  const res = await fetch(`${API_BASE}/api/vehicle-inspections/${id}`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch vehicle inspection");
  return res.json();
}

export async function submitInspectionReport(id: string, file: File): Promise<{ ok: boolean; reportUrl: string }> {
  const formData = new FormData();
  formData.append("report", file);

  const res = await fetch(`${API_BASE}/api/vehicle-inspections/${id}/report`, {
    method: "POST",
    body: formData,
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to submit inspection report");
  return res.json();
}

export type VehicleReservationData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear?: string;
  budget?: string;
  notes?: string;
};

export async function submitVehicleReservation(data: VehicleReservationData, paymentProof: File): Promise<{ ok: boolean; id: string }> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  formData.append("paymentProof", paymentProof);

  const res = await fetch(`${API_BASE}/api/vehicle-reservations`, {
    method: "POST",
    body: formData,
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to submit vehicle reservation request");
  return res.json();
}

export async function getVehicleReservation(id: string): Promise<VehicleReservationData & { id: string, status: string, reservedVehicleUrl?: string, paymentProofUrl?: string }> {
  const res = await fetch(`${API_BASE}/api/vehicle-reservations/${id}`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch vehicle reservation");
  return res.json();
}

export async function confirmVehicleReservation(id: string, reservedVehicleUrl: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/vehicle-reservations/${id}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reservedVehicleUrl }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to confirm vehicle reservation");
  return res.json();
}

export type VehicleFindRequestData = {
  title: string;
  make: string;
  year: string;
  mileage?: string;
  color?: string;
  listingUrl: string;
  name: string;
  email: string;
  phone?: string;
};

export async function submitVehicleFindRequest(data: VehicleFindRequestData): Promise<{ ok: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/api/vehicle-find-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to submit vehicle find request");
  return res.json();
}

export async function getVehicleFindRequest(id: string): Promise<VehicleFindRequestData & { id: string, status: string, foundVehicleUrl?: string, adminNote?: string }> {
  const res = await fetch(`${API_BASE}/api/vehicle-find-requests/${id}`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch vehicle find request");
  return res.json();
}

export async function respondVehicleFindRequest(id: string, foundVehicleUrl: string, adminNote?: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/vehicle-find-requests/${id}/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ foundVehicleUrl, adminNote }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to respond to vehicle find request");
  return res.json();
}

export type SubscriptionData = {
  planId: string;
  planName: string;
  price: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  paymentMethod: string;
};

export async function submitSubscription(data: SubscriptionData, paymentProof?: File): Promise<{ ok: boolean; id: string }> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  if (paymentProof) formData.append("paymentProof", paymentProof);

  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: "POST",
    body: formData,
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to submit subscription");
  return res.json();
}

export async function getSubscription(id: string): Promise<SubscriptionData & { id: string, status: string, paymentProofUrl?: string, adminNote?: string }> {
  const res = await fetch(`${API_BASE}/api/subscriptions/${id}`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch subscription");
  return res.json();
}

export async function updateSubscriptionStatus(id: string, status: string, adminNote?: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/subscriptions/${id}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, adminNote }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to update subscription status");
  return res.json();
}

export async function getPaymentDetails(): Promise<{
  bank: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
    swiftCode: string;
  };
  paypal: {
    email: string;
  };
}> {
  const res = await fetch(`${API_BASE}/api/config/payment-details`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch payment details");
  return res.json();
}

export async function resubmitPayment(type: "subscription" | "inspection" | "reservation", id: string, paymentProof: File): Promise<{ ok: boolean }> {
  const formData = new FormData();
  formData.append("paymentProof", paymentProof);

  const endpoint = type === "subscription" ? "subscriptions" : 
                   type === "inspection" ? "vehicle-inspections" : 
                   "vehicle-reservations";

  const res = await fetch(`${API_BASE}/api/${endpoint}/${id}/resubmit-payment`, {
    method: "POST",
    body: formData,
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to resubmit payment proof");
  return res.json();
}

export async function toggleWatchlist(listingId: string): Promise<{ watched: boolean }> {
  const res = await fetch(`${API_BASE}/api/watchlist/toggle/${encodeURIComponent(listingId)}`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to toggle watchlist");
  return res.json();
}

export async function getWatchlistStatus(listingId: string): Promise<{ watched: boolean }> {
  const res = await fetch(`${API_BASE}/api/watchlist/status/${encodeURIComponent(listingId)}`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to get watchlist status");
  return res.json();
}

export async function fetchMyWatchlist(): Promise<CarsResponse> {
  const res = await fetch(`${API_BASE}/api/watchlist`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch watchlist");
  return res.json();
}
