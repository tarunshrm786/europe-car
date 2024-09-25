// import { useSelector } from "react-redux";
// import { errorPop } from "../sweetalert";

// function PriceBreakdown({
//   txn_id,
//   carDetails,
//   bookingData,
//   handleRemoveCoupon,
//   couponCode,
//   setCouponCode,
//   handleApplyCoupon,
//   applyCouponLoading,
//   bookingLoading,
//   couponError,
//   setCouponError,
//   isValid,
//   staticData,
// }) {

  
//   const { userData } = useSelector((state) => state.auth);
//   const { currency_symbol } = useSelector((state) => state.headData);
//   let finalAmt = txn_id
//     ? Number(carDetails?.grand_total) -
//     Number(bookingData?.data?.old_booking?.grandtotal)
//     : 0;
//   const extradata = bookingData?.data?.extra_details? JSON.parse(bookingData?.data?.extra_details):'';

//   return (
//     <div className="col-lg-3 col-md-12">
//       <section className="p-0 main-sta">
//         <div className="pick-lcton">
//           <h3>{staticData?.data?.price_breakdown} </h3>
//           {userData?.role_id == 3 && (
//             <>
//               <p>
//                 {staticData?.data?.original_car_rental_price}
//                 <span>
//                   {txn_id && carDetails
//                     ? currency_symbol +
//                     "" +
//                     Math.round(
//                       carDetails.original_price_per_day_grandtotal * 100
//                     ) /
//                     100
//                     : currency_symbol +
//                     "" +
//                     Math.round(
//                       bookingData?.data?.original_price_per_day_grandtotal *
//                       100
//                     ) /
//                     100}
//                 </span>
//               </p>
//               <hr />
//             </>
//           )}
//           <p>
//             {staticData?.data?.car_rental_price}{" "}
//             {userData?.role_id == 3 && staticData?.data?.for_you}
//             <span>
//               {txn_id && carDetails
//                 ? currency_symbol +
//                 "" +
//                 Math.round(carDetails.car_pricing_per_day * 100) / 100
//                 : currency_symbol +
//                 "" +
//                 Math.round(bookingData?.data?.car_pricing_per_day * 100) /
//                 100}
//             </span>
//           </p>
//           <hr />
//           <p>
//             {staticData?.data?.price_for}{" "}
//             {txn_id && carDetails
//               ? carDetails.total_days
//               : bookingData?.data?.total_days}{" "}
//             {staticData?.data?.days}:
//             <span>
//               {txn_id && carDetails
//                 ? currency_symbol +
//                 "" +
//                 Math.round(carDetails.price_per_day_grandtotal * 100) / 100
//                 : currency_symbol +
//                 "" +
//                 Math.round(
//                   bookingData?.data?.price_per_day_grandtotal * 100
//                 ) /
//                 100}
//             </span>
//           </p>
//           <hr />
//           {txn_id && carDetails
//             ? carDetails.with_full_protection_applied == "1" && (
//               <>
//                 <p>
//                   {staticData?.data?.full_protection_charge}:
//                   <span>
//                     +{" "}
//                     {currency_symbol +
//                       "" +
//                       Math.round(
//                         carDetails?.applied_full_protection_amount * 100
//                       ) /
//                       100}
//                   </span>
//                 </p>
//                 <hr />
//               </>
//             )
//             : bookingData?.data?.with_full_protection_applied == "1" && (
//               <>
//                 <p>
//                   {staticData?.data?.full_protection_charge}:
//                   <span>
//                     +{" "}
//                     {currency_symbol +
//                       "" +
//                       Math.round(
//                         bookingData?.data?.applied_full_protection_amount *
//                         100
//                       ) /
//                       100}
//                   </span>
//                 </p>
//                 <hr />
//               </>
//             )}
//           {txn_id && carDetails
//             ? ""
//             : bookingData?.data?.coupon_applied == "1" && (
//               <>
//                 <p>
//                   {staticData?.data?.coupon_discount}:
//                   <span>
//                     -
//                     {currency_symbol +
//                       "" +
//                       Math.round(
//                         bookingData?.data?.coupon_applied_saving_amount * 100
//                       ) /
//                       100}
//                   </span>
//                 </p>
//                 <hr />
//               </>
//             )}
//           {txn_id && carDetails
//             ? ""
//             : bookingData?.data?.pay_on_arrival_charge && (
//               <>
//                 <p>
//                   {staticData?.data?.payon_arrival_fees}:
//                   <span>
//                     {currency_symbol +
//                       "" +
//                       Math.round(
//                         bookingData?.data?.pay_on_arrival_charge * 100
//                       ) /
//                       100}
//                   </span>
//                 </p>
//                 <hr />
//               </>
//             )}
          
//           {
//             extradata?.Daily_rate && (
//               <>
//               <p>
//               Extra:
//                 <span>
//                   {extradata?.Daily_rate
//                       ? currency_symbol +
//                       "" +
//                       Math.round(extradata?.Daily_rate * 100) / 100
//                       : 0}
//                 </span>
//               </p>
//               <hr />
//               </>
//             )
//           }
          
         
//           <p>
//             {staticData?.data?.total_amount}:
//             <span>
//               {txn_id && carDetails
//                 ? carDetails.grand_total
//                   ? currency_symbol +
//                   "" +
//                   Math.round(carDetails?.grand_total * 100) / 100
//                   : 0
//                 : bookingData?.data?.grand_total
//                   ? currency_symbol +
//                   "" +
//                   Math.round(bookingData?.data?.grand_total * 100) / 100
//                   : 0}
//             </span>
//           </p>

//           <hr />
//           {txn_id && (
//             <>
//               <p>
//                 {staticData?.data?.previous_paid_account}:
//                 <span>
//                   {currency_symbol +
//                     "" +
//                     Math.round(
//                       bookingData?.data?.old_booking?.grandtotal * 100
//                     ) /
//                     100}
//                 </span>
//               </p>
//               <hr />
//               <p>
//                 {staticData?.data?.final_account_to_pay}:
//                 <span>
//                   {currency_symbol + "" + Math.round(finalAmt * 100) / 100}
//                 </span>
//               </p>
//               <hr />
//             </>
//           )}
//           {txn_id && carDetails ? (
//             ""
//           ) : bookingData?.data?.coupon_applied == "1" ? (
//             <div className="coupon">
//               <div className="coupon_containerss">
//                 <p>{bookingData?.data?.coupon_code}</p>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     handleRemoveCoupon(
//                       bookingData?.data?.coupon_code,
//                       bookingData?.data?.id
//                     )
//                   }
//                 >
//                   X
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <p className="prm-aply cpn-cde-ap">
//               <input
//                 type="text"
//                 name="promo_code"
//                 id=""
//                 placeholder={staticData?.data?.coupon_code}
//                 value={couponCode}
//                 onChange={(e) => {
//                   setCouponCode(e.target.value);
//                   setCouponError(false);
//                 }}
//                 readOnly={bookingData?.data?.coupon_applied == "1"}
//               />{" "}
//               <span>
//                 <button
//                   type="button"
//                   onClick={handleApplyCoupon}
//                   disabled={
//                     bookingData?.data?.coupon_applied == "1" ||
//                     applyCouponLoading
//                   }
//                 >
//                   {applyCouponLoading
//                     ? staticData?.data?.loading
//                     : staticData?.data?.apply}
//                 </button>
//               </span>
//             </p>
//           )}
//           {couponError ? (
//             <span className="validation-err1">
//               {staticData?.data?.field_is_required}
//             </span>
//           ) : null}
//         </div>
//         {/* <div className="car-choice pick-lcton p-3 shadow-none">
//         <h3 className="mb-3">Great choice!</h3>
//         <ul>
//           <li>
//             <img src="/assets/img/left-eorw.svg" alt="" /> Customer rating: 6.4
//             / 10
//           </li>
//           <li>
//             <img src="/assets/img/left-eorw.svg" alt="" /> Clean cars
//           </li>
//           <li>
//             <img src="/assets/img/left-eorw.svg" alt="" /> Most popular fuel
//             policy{" "}
//           </li>
//           <li>
//             <img src="/assets/img/left-eorw.svg" alt="" /> Free Cancellation{" "}
//           </li>
//           <li>
//             <img src="/assets/img/left-eorw.svg" alt="" /> Well-maintained cars{" "}
//           </li>
//         </ul>
//       </div> */}
//         <button
//           className="sub-inq"
//           // data-bs-toggle="modal"
//           // data-bs-target="#pmt-mdl"
//           onClick={() => {
//             if (!isValid) {
//               errorPop("", staticData?.data?.please_complete_form);
//             }
//           }}
//           type={bookingLoading ? "button" : "submit"}
//           disabled={bookingLoading}
//         >
//           {bookingLoading ? staticData?.data?.loading : staticData?.data?.book_now}
//         </button>
//       </section>
//     </div>
//   );
// }

// export default PriceBreakdown;

//work

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/router"; // Assuming you're using Next.js
// import { errorPop } from "../sweetalert";

// function PriceBreakdown({
//   txn_id,
//   carDetails,
//   handleRemoveCoupon,
//   couponCode,
//   setCouponCode,
//   handleApplyCoupon,
//   applyCouponLoading,
//   bookingLoading,
//   couponError,
//   setCouponError,
//   isValid,
//   staticData,
// }) {
//   const { userData } = useSelector((state) => state.auth);
//   const { currency_symbol } = useSelector((state) => state.headData);
//   const router = useRouter();
//   const [bookingDetails, setBookingDetails] = useState(null);

//   // Effect to fetch and parse booking data from URL
//   useEffect(() => {
//     const { bookingData } = router.query;

//     if (bookingData) {
//       try {
//         const decodedData = decodeURIComponent(bookingData);
//         const parsedData = JSON.parse(decodedData);
//         console.log('Booking Data:', parsedData);
//         setBookingDetails(parsedData);
//       } catch (error) {
//         console.error('Error parsing booking data:', error);
//       }
//     }
//   }, [router.query]);

//   let finalAmt = txn_id
//     ? Number(carDetails?.grand_total) - Number(bookingDetails?.old_booking?.grandtotal)
//     : 0;

//   const extradata = bookingDetails?.extra_details ? JSON.parse(bookingDetails.extra_details) : '';

//   return (
//     <div className="col-lg-3 col-md-12">
//       <section className="p-0 main-sta">
//         <div className="pick-lcton">
//           <h3>{staticData?.data?.price_breakdown}</h3>
//           {userData?.role_id == 3 && (
//             <>
//               <p>
//                 {staticData?.data?.original_car_rental_price}
//                 <span>
//                   {txn_id && carDetails
//                     ? currency_symbol + Math.round(carDetails.original_price_per_day_grandtotal * 100) / 100
//                     : currency_symbol + Math.round(bookingDetails?.original_price_per_day_grandtotal * 100) / 100}
//                 </span>
//               </p>
//               <hr />
//             </>
//           )}
//           {/* Other price breakdown sections... */}

          
          
//           <p>
//             {staticData?.data?.total_amount}:
//             <span>
//               {bookingDetails?.total
//                 ? currency_symbol + Math.round(bookingDetails.total * 100) / 100
//                 : 0}
//             </span>
//           </p>

//           <hr />
//           {txn_id && (
//             <>
//               <p>
//                 {staticData?.data?.previous_paid_account}:
//                 <span>
//                   {currency_symbol + Math.round(bookingDetails?.old_booking?.grandtotal * 100) / 100}
//                 </span>
//               </p>
//               <hr />
//               <p>
//                 {staticData?.data?.final_account_to_pay}:
//                 <span>
//                   {currency_symbol + Math.round(finalAmt * 100) / 100}
//                 </span>
//               </p>
//               <hr />
//             </>
//           )}
//           {/* Continue rendering... */}
//           <button
//             className="sub-inq"
//             onClick={() => {
//               if (!isValid) {
//                 errorPop("", staticData?.data?.please_complete_form);
//               }
//             }}
//             type={bookingLoading ? "button" : "submit"}
//             disabled={bookingLoading}
//           >
//             {bookingLoading ? staticData?.data?.loading : staticData?.data?.book_now}
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default PriceBreakdown;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router"; // Assuming you're using Next.js
import { errorPop } from "../sweetalert";

function PriceBreakdown({
  txn_id,
  carDetails,
  handleRemoveCoupon,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  applyCouponLoading,
  bookingLoading,
  couponError,
  setCouponError,
  isValid,
  staticData,
}) {
  const { userData } = useSelector((state) => state.auth);
  const { currency_symbol } = useSelector((state) => state.headData);
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);

  // console.log('Static Data--------------:', userData?.data?.total);

  // Effect to fetch and parse booking data from URL
  useEffect(() => {
    const { bookingData } = router.query;

    if (bookingData) {
      try {
        const decodedData = decodeURIComponent(bookingData);
        const parsedData = JSON.parse(decodedData);
        console.log('Booking Data--------------:', parsedData);
        setBookingDetails(parsedData);
      } catch (error) {
        console.error('Error parsing booking data:', error);
      }
    }
  }, [router.query]);

  let finalAmt = txn_id
    ? Number(carDetails?.grand_total) - Number(bookingDetails?.old_booking?.grandtotal)
    : 0;

  const extradata = bookingDetails?.extra_details ? JSON.parse(bookingDetails.extra_details) : '';

  return (
    <div className="col-lg-3 col-md-12">
      <section className="p-0 main-sta">
        <div className="pick-lcton">
          <h3>{staticData?.data?.price_breakdown}</h3>
          
          {userData?.role_id == 3 && (
            <>
              <p>
                {staticData?.data?.original_car_rental_price}
                <span>
                  {txn_id && carDetails
                    ? currency_symbol + Math.round(carDetails.original_price_per_day_grandtotal * 100) / 100
                    : currency_symbol + Math.round(bookingDetails?.original_price_per_day_grandtotal * 100) / 100}
                </span>
              </p>
              <hr />
            </>
          )}

          {/* <p>
            {staticData?.data?.car_rental_price}{" "}
            {userData?.role_id == 3 && staticData?.data?.for_you}
            <span>
              {txn_id && carDetails
                ? currency_symbol + Math.round(carDetails.car_pricing_per_day * 100) / 100
                : currency_symbol + Math.round(bookingDetails?.data?.car_pricing_per_day * 100) / 100}
            </span>
          </p>
          <hr />

          <p>
            {staticData?.data?.price_for}{" "}
            {txn_id && carDetails ? carDetails.total_days : bookingDetails?.data?.total_days}{" "}
            {staticData?.data?.days}:
            <span>
              {txn_id && carDetails
                ? currency_symbol + Math.round(carDetails.price_per_day_grandtotal * 100) / 100
                : currency_symbol + Math.round(bookingDetails?.data?.price_per_day_grandtotal * 100) / 100}
            </span>
          </p>
          <hr /> */}

{/* <p>
  {staticData?.data?.car_rental_price}{" "}
  {userData?.role_id === 3 && staticData?.data?.for_you}
  <span>
    {txn_id && carDetails
      ? currency_symbol + (carDetails.car_pricing_per_day ? Math.round(carDetails.car_pricing_per_day * 100) / 100 : "0.00")
      : bookingDetails?.data?.car_pricing_per_day ? currency_symbol + Math.round(bookingDetails.data.car_pricing_per_day * 100) / 100 : currency_symbol + "0.00"}
  </span>
</p>
<hr />

<p>
  {staticData?.data?.price_for}{" "}
  {txn_id && carDetails ? carDetails.total_days : bookingDetails?.data?.total_days}{" "}
  {staticData?.data?.days}:
  <span>
    {txn_id && carDetails
      ? currency_symbol + (carDetails.price_per_day_grandtotal ? Math.round(carDetails.price_per_day_grandtotal * 100) / 100 : "0.00")
      : bookingDetails?.data?.price_per_day_grandtotal ? currency_symbol + Math.round(bookingDetails.data.price_per_day_grandtotal * 100) / 100 : currency_symbol + "0.00"}
  </span>
</p>
<hr /> */}

<p>
   Car Rental Price: {bookingDetails?.selectedService?.code} - 
  <span>
    {currency_symbol + parseFloat(bookingDetails?.car).toFixed(2)}
  </span>
</p>
<hr />

{/* Display selected service */}
<p>
  Selected Service: {bookingDetails?.selectedService?.code} - 
  <span>
    {currency_symbol + parseFloat(bookingDetails?.selectedService?.price).toFixed(2)}
  </span>
</p>
<hr />

{/* Display additional services */}
<p>Additional Services:
{bookingDetails?.additionalServices?.length > 0 ? (
  <ul>
    {bookingDetails.additionalServices.map((service, index) => (
      <li key={index}>
        {service.code} ({service.qty} {service.per}) - 
        <span>
          {currency_symbol + parseFloat(service.price).toFixed(2)}
        </span>
      </li>
    ))}
  </ul>
) : (
  <p>No additional services selected.</p>
)}
</p>
<hr />


          {txn_id && carDetails
            ? carDetails.with_full_protection_applied === "1" && (
                <>
                  <p>
                    {staticData?.data?.full_protection_charge}:
                    <span>
                      +{" "}
                      {currency_symbol + Math.round(carDetails?.applied_full_protection_amount * 100) / 100}
                    </span>
                  </p>
                  <hr />
                </>
              )
            : bookingDetails?.data?.with_full_protection_applied === "1" && (
                <>
                  <p>
                    {staticData?.data?.full_protection_charge}:
                    <span>
                      +{" "}
                      {currency_symbol + Math.round(bookingDetails?.data?.applied_full_protection_amount * 100) / 100}
                    </span>
                  </p>
                  <hr />
                </>
              )}

          {txn_id && carDetails
            ? ""
            : bookingDetails?.data?.coupon_applied === "1" && (
                <>
                  <p>
                    {staticData?.data?.coupon_discount}:
                    <span>
                      -{currency_symbol + Math.round(bookingDetails?.data?.coupon_applied_saving_amount * 100) / 100}
                    </span>
                  </p>
                  <hr />
                </>
              )}

          {txn_id && carDetails
            ? ""
            : bookingDetails?.data?.pay_on_arrival_charge && (
                <>
                  <p>
                    {staticData?.data?.payon_arrival_fees}:
                    <span>
                      {currency_symbol + Math.round(bookingDetails?.data?.pay_on_arrival_charge * 100) / 100}
                    </span>
                  </p>
                  <hr />
                </>
              )}

          {extradata?.Daily_rate && (
            <>
              <p>
                Extra:
                <span>
                  {extradata?.Daily_rate
                    ? currency_symbol + Math.round(extradata?.Daily_rate * 100) / 100
                    : 0}
                </span>
              </p>
              <hr />
            </>
          )}

          <p>
            {staticData?.data?.total_amount}:
            <span>
              {bookingDetails?.total
                ? currency_symbol + Math.round(bookingDetails.total * 100) / 100
                : 0}
            </span>
          </p>

          <hr />
          {txn_id && (
            <>
              <p>
                {staticData?.data?.previous_paid_account}:
                <span>
                  {currency_symbol + Math.round(bookingDetails?.old_booking?.grandtotal * 100) / 100}
                </span>
              </p>
              <hr />
              <p>
                {staticData?.data?.final_account_to_pay}:
                <span>
                  {currency_symbol + Math.round(finalAmt * 100) / 100}
                </span>
              </p>
              <hr />
            </>
          )}

          <button
            className="sub-inq"
            onClick={() => {
              if (!isValid) {
                errorPop("", staticData?.data?.please_complete_form);
              }
            }}
            type={bookingLoading ? "button" : "submit"}
            disabled={bookingLoading}
          >
            {bookingLoading ? staticData?.data?.loading : staticData?.data?.book_now}
          </button>
        </div>
      </section>
    </div>
  );
}

export default PriceBreakdown;
