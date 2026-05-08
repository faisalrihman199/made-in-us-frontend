import React, { forwardRef } from 'react';

interface InvoiceTemplateProps {
  invoiceNo: string;
  date: string;
  clientInfo: {
    firstName: string;
    lastName: string;
    address: string;
    country: string;
    phone: string;
    email: string;
  };
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    vin: string;
    price: number;
  };
  pricing: {
    processingFee: number;
    serviceFee: number;
    totalAmount: number;
  };
}

const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>((props, ref) => {
  const { invoiceNo, date, clientInfo, vehicleInfo, pricing } = props;

  return (
    <div 
      ref={ref} 
      className="bg-white p-12 w-[800px] text-[#1a2b3c] font-sans"
      style={{ position: 'absolute', left: '-9999px', top: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <img src="/logo.png" alt="Made-In-US" className="w-[240px] h-auto object-contain" />
          </div>
          <p className="text-[14px] text-gray-600 font-medium ml-1">Connecting buyers with American sellers</p>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] mb-3 text-[#0b2447]">Invoice</h1>
          <p className="text-sm font-bold text-gray-500 mb-1">SecurePay vehicle payment</p>
          <p className="text-sm font-medium">Invoice No: <span className="font-bold text-[#0b2447]">{invoiceNo}</span></p>
          <p className="text-sm font-medium">Date: <span className="font-bold text-[#0b2447]">{date}</span></p>
        </div>
      </div>

      <div className="h-[2px] bg-gray-100 mb-10"></div>

      {/* From / To */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-[#f2f4f7] px-4 py-2 border-b">
            <h3 className="font-bold uppercase text-[13px] tracking-wider text-[#0b2447]">From</h3>
          </div>
          <div className="p-4 space-y-1 text-sm">
            <p className="font-bold text-[#0b2447]">Made-In-US.com</p>
            <p>Connecting buyers with American sellers</p>
            <p>Vehicle marketplace and export services</p>
            <p className="pt-1">Email: contact@made-in-us.com</p>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-[#f2f4f7] px-4 py-2 border-b">
            <h3 className="font-bold uppercase text-[13px] tracking-wider text-[#0b2447]">Bill To</h3>
          </div>
          <div className="p-4 space-y-1 text-sm">
            <p className="font-bold text-[#0b2447]">{clientInfo.firstName} {clientInfo.lastName}</p>
            <p>{clientInfo.address}</p>
            <p>{clientInfo.country}</p>
            <p className="pt-1">Phone: {clientInfo.phone}</p>
            <p>Email: {clientInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Vehicle Info Table */}
      <div className="mb-10">
        <h2 className="text-[17px] font-bold text-[#0b2447] mb-3">Vehicle Information</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0b2447] text-white text-left">
              <th className="px-4 py-3 text-sm font-bold border-r border-white/10">Make</th>
              <th className="px-4 py-3 text-sm font-bold border-r border-white/10">Model</th>
              <th className="px-4 py-3 text-sm font-bold border-r border-white/10">Year</th>
              <th className="px-4 py-3 text-sm font-bold border-r border-white/10">VIN / Serial Number</th>
              <th className="px-4 py-3 text-sm font-bold">Vehicle Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm border-x">{vehicleInfo.make}</td>
              <td className="px-4 py-3 text-sm border-r">{vehicleInfo.model}</td>
              <td className="px-4 py-3 text-sm border-r">{vehicleInfo.year}</td>
              <td className="px-4 py-3 text-sm border-r">{vehicleInfo.vin}</td>
              <td className="px-4 py-3 text-sm font-bold text-right border-r">${vehicleInfo.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Summary Table */}
      <div className="mb-12">
        <h2 className="text-[17px] font-bold text-[#0b2447] mb-3">Payment Summary</h2>
        <table className="w-full border-collapse border-t border-gray-100">
          <thead>
            <tr className="bg-[#f8f9fc] text-left">
              <th className="px-4 py-3 text-sm font-bold border-b text-[#0b2447]">Description</th>
              <th className="px-4 py-3 text-sm font-bold border-b text-right text-[#0b2447]">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm">Vehicle price</td>
              <td className="px-4 py-3 text-sm font-bold text-right">${vehicleInfo.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm">SecurePay processing fee</td>
              <td className="px-4 py-3 text-sm font-bold text-right">${pricing.processingFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm">SecurePay service fee - 3% of vehicle price</td>
              <td className="px-4 py-3 text-sm font-bold text-right">${pricing.serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr className="bg-[#fcfdfd]">
              <td className="px-4 py-6 text-lg font-bold text-[#0b2447]">Total amount due</td>
              <td className="px-4 py-6 text-3xl font-black text-[#107050] text-right">
                ${pricing.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-10 text-center text-[13px] space-y-1.5 text-gray-500 font-bold leading-relaxed max-w-[600px] mx-auto">
        <p>If you are interested in this vehicle, please contact one of our advisors.</p>
        <p>Thank you for choosing Made-In-US for your vehicle purchase.</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
