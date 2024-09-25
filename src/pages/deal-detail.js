import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import moment from "moment/moment";
import Link from "next/link";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import ListForm from "@/components/List";
import ImportantInfo from "@/components/List/ImportantInfo";
import { errorMsg, successMsg } from "@/components/Toast";
import {
  useGuest_loginMutation,
  useStaticContentQuery,
  useVehicalDetailsQuery,
} from "@/store/Slices/apiSlice";
import { getCookieData, setCookies, removeCookie, roundNum } from "@/utils/helper";
import { loggedIn, userDataUpdate } from "@/store/Slices/authSlice";
import { langUpdate } from "@/store/Slices/headerSlice";
import Header from "@/components/Header";
import Head from "next/head";
import { round } from "lodash";

function DealDetail(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showImptinfo, setImptinfo] = useState(false);
  const [showHeroSec, setShowHeroSec] = useState(false);
  const [isActive, setActive] = useState(false);
  const [extraDetails, setextraDetails] = useState('');
const [totalPrice,setTotalPrice] = useState(0);

const [selectedCode, setSelectedCode] = useState(null); // Initialize selectedCode
// Add state to track selected code price
const [selectedCodePrice, setSelectedCodePrice] = useState(0);

  const { currency, currency_symbol, lang } = useSelector(
    (state) => state.headData
  );



  useEffect(() => {
    removeCookie('selected_extra_details');
  }, [])

  const [guest_login, { isLoading: loginLoading }] = useGuest_loginMutation();
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

  console.log("staticData", staticData)
  const handleCloseImptInfo = () => setImptinfo(false);

  let transactionId = props?.txn_id;
  let token = props?.token;

  let dataForSearch =
    getCookieData("searchData") && JSON.parse(getCookieData("searchData"));
  let selectedCarId = getCookieData("dealCarId");

  if (props?.search_id != null) {
    var search_id = props?.search_id;
    setCookies("inserted_id", props?.search_id);
  } else {
    var search_id = getCookieData("inserted_id");
  }

  if (props?.procode != null) {
    var proCode = props?.procode;
    setCookies("proCode", proCode);
  } else {
    var proCode = getCookieData("proCode");
  }

  let postData = {
    proCode: proCode ? proCode : "",
    car_id: selectedCarId ? selectedCarId : "",
    search_id: search_id ? search_id : "",
    pickup_location: dataForSearch?.pickup_location
      ? dataForSearch?.pickup_location
      : "",
    return_location: dataForSearch?.return_location
      ? dataForSearch?.return_location
      : "",
    pickup_datetime: dataForSearch?.pickup_datetime
      ? dataForSearch?.pickup_datetime
      : "",
    return_datetime: dataForSearch?.return_datetime
      ? dataForSearch?.return_datetime
      : "",
    unique_time: dataForSearch?.unique_time,
    without_credit_card: dataForSearch?.without_credit_card,
    ...(transactionId && { txn_id: transactionId }),
    ...(currency && { currency_id: currency }),
    ...(props.userData?.id && { user_id: props.userData?.id }),
    lang_id: lang,
  };

  const { data, isLoading } = useVehicalDetailsQuery(postData, {
    refetchOnMountOrArgChange: true,
  });


function safeParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Invalid JSON:", error);
    return null; 
  }
}

  let eurocar_insurance = safeParse(data?.data?.eurocar_insurance);
  console.log("====", eurocar_insurance);

  let eurocar_equipment = safeParse(data?.data?.eurocar_equipment);
  console.info("---", eurocar_equipment);

  console.log("data", data?.data)
  // const handleRedirect = async (pro_code) => {
  //   await setCookies("proCode", pro_code);
  //   router.reload();
  // };
  
  // const handleRedirect = async (pro_code, price) => {
  //   await setCookies("proCode", pro_code);
  //   setSelectedCode(pro_code); // Set the selected code
  //   console.log(`Selected code: ${pro_code}, price: ${price}`);
  //   //router.reload(); // You can remove this if reloading is not needed
  // };

  const [selectedPrice, setSelectedPrice] = useState(0);   // To store selected price
  const [selectedExtras, setSelectedExtras] = useState([]);

  const handleRedirect = async (pro_code, price) => {
    await setCookies("proCode", pro_code);
    setSelectedCode(pro_code);
    setSelectedCodePrice(price);  // Update selected price
    console.log(`Selected code: ${pro_code}, price: ${price}`);

    // const updatedTotal = data?.data?.car[0]?.car_total_pricing + price;
    // console.log('Updated total value:', updatedTotal);
    const carTotalPricing = parseFloat(data?.data?.car[0]?.car_total_pricing) || 0; // Ensure it's a number
    const selectedPrice = parseFloat(price) || 0; // Ensure it's a number
    const updatedTotal = carTotalPricing + selectedPrice;
    console.log('Updated total value:', updatedTotal);
   // router.reload();  // Remove this line if you don't want to reload the page
  };

  const handleSetExtraData = (res) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((extra) => extra.code === res.code);
      if (exists) {
        // Remove if already selected
        return prev.filter((extra) => extra.code !== res.code);
      } else {
        // Add if not selected
        return [...prev, res];
      }
    });
  };
  

  // Calculate the total pricing by adding selected insurance price to car pricing
  const carTotalWithInsurance = Math.round((data?.data?.car[0]?.car_total_pricing + selectedPrice) * 100) / 100;


  let selected_pack;
  if (getCookieData('proCode') !== '') {
    selected_pack = getCookieData('proCode');
  } else {
    selected_pack = 'BAS';
  }
  let newres;
  // const handleSetExtraData = async (res) => {
  //   newres = res;
  //   await setextraData_fun(res);
  // };
  
  const setextraData_fun = async (res) => {
    if (getCookieData('selected_extra_details')) {
      var get_selected_extra_details = JSON.parse(getCookieData('selected_extra_details'));
  
      console.log("get_selected_extra_details", get_selected_extra_details);

  
      if (get_selected_extra_details.code === res?.code) {
        setActive(false);
        setextraDetails('');
        removeCookie('selected_extra_details');
          // Ensure both values are numbers
      let grandTotal = parseFloat(data?.data?.car[0]?.grandTotal) || 0;
      let extraPrice = parseFloat(get_selected_extra_details?.price) || 0;
  
      console.log("Type of grandTotal:", typeof grandTotal); // Should be 'number'
      console.log("Type of extraPrice:", typeof extraPrice); // Should be 'number'
  
      console.log("grandTotal:", grandTotal);
      console.log("extraPrice:", extraPrice);
  
      let updatedPrice = (grandTotal + extraPrice).toFixed(2); 

  
      console.log("Updated Price:", updatedPrice);
      setTotalPrice(updatedPrice);
      } else {
        setActive(res?.code);
        setextraDetails(res);
        await setCookies("selected_extra_details", JSON.stringify(res));
      }
    } else {
      // First click: set cookie and calculate price again
      setActive(res?.code);
      setextraDetails(res);
      await setCookies("selected_extra_details", JSON.stringify(res));
  
      // Set the extra price after the cookie is set
      let grandTotal = parseFloat(data?.data?.car[0]?.grandTotal) || 0;
      let extraPrice = parseFloat(res?.price) || 0;  // Use 'res' since cookie wasn't available
  
      let updatedPrice = grandTotal + extraPrice;
      console.log("First click Updated Price:", updatedPrice);
      setTotalPrice(updatedPrice);
    }
  };
  
  
  let extra_rate = 0;
  if (extraDetails != '') {
    extra_rate = extraDetails?.Daily_rate;
  }

  let signupurl;
  if (lang == 1) {
    signupurl = '/en/login?callbackUrl=deal-booking';
  } else {
    signupurl = '/login?callbackUrl=deal-booking';
  }

  // const goToBooking = async (id) => {

  //   if (id === 1) {
  //     if (data?.data?.car[0]?.supplier_id === 36) {
  //       return Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         text: "Full Protection not available for this car.",
  //       });
  //     }
  //   }
  //   await setCookies("withProtection", id);
  //   if (token) {
  //     setTimeout(() => {
  //       let url = data?.data?.txn_id
  //         ? `/deal-booking?txn_id=${data?.data?.txn_id}`
  //         : "/deal-booking";
  //       router.push(url);
  //     }, 100);
  //   } else {
  //     Swal.fire({
  //       title: "",
  //       // html: "<a href='" + signupurl + "'>Signup</a>",
  //       showCancelButton: true,
  //       icon: "warning",
  //       showCancelButton: true,
  //       // confirmButtonColor: "#e2731e",
  //       customClass: {
  //         confirmButton: "sweet-alert-yes-button-confirm",
  //         cancelButton: "sweet-alert-cancel-button-cancel",
  //       },
  //       buttonsStyling: false,
  //       cancelButtonText: "Login / Sign up",
  //       confirmButtonText: "Continue Booking As A Guest",
  //       reverseButtons: true,
  //     }).then(async (result) => {
  //       if (result.isConfirmed) {
  //         try {
  //           let response = await guest_login().unwrap();

  //           response.message && successMsg(response.message);

  //           await setCookies("origin_rent_token", response?.data?.token);
  //           await setCookies(
  //             "origin_rent_userdata",
  //             JSON.stringify(response?.data)
  //           );
  //           dispatch(
  //             langUpdate({
  //               lang: response?.data?.lang_id,
  //               lang_code: response?.data?.lang_code,
  //             })
  //           );
  //           dispatch(loggedIn(true));
  //           dispatch(userDataUpdate(response?.data));

  //           setTimeout(() => {
  //             let url = data?.data?.txn_id
  //               ? `/deal-booking?txn_id=${data?.data?.txn_id}`
  //               : "/deal-booking";
  //             router.push(url);
  //           }, 100);
  //         } catch (error) {
  //           let err = error?.data?.message
  //             ? error?.data?.message
  //             : error.message;
  //           errorMsg(err);
  //         }
  //       } else {
  //         router.push(`/login?callbackUrl=deal-booking`);
  //       }
  //     });
  //   }
  // };
  const goToBooking = async (id) => {
    if (id === 1) {
      if (data?.data?.car[0]?.supplier_id === 36) {
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Full Protection not available for this car.",
        });
      }
    }
  
    await setCookies("withProtection", id);
  
    // Calculate total price with selected services
    const totalPrice = roundNum(
      Number(data?.data?.car[0]?.grandTotal || 0) +
      Number(selectedCodePrice || 0) +
      selectedExtras.reduce((total, extra) => total + Number(extra.price), 0)
    );
  
    const bookingData = {
      total: totalPrice,
      // selectedService: selectedCode,
      car: data?.data?.car[0]?.grandTotal,
      selectedService: {
        code: selectedCode,
        price: selectedCodePrice,  // Add the price here
      },
      additionalServices: selectedExtras,
    };
  
    const queryString = new URLSearchParams({ bookingData: JSON.stringify(bookingData) }).toString();
  
    if (token) {
      setTimeout(() => {
        let url = data?.data?.txn_id
          ? `/deal-booking?txn_id=${data?.data?.txn_id}&${queryString}`
          : `/deal-booking?${queryString}`;
        router.push(url);
      }, 100);
    } else {
      Swal.fire({
        title: "",
        showCancelButton: true,
        icon: "warning",
        customClass: {
          confirmButton: "sweet-alert-yes-button-confirm",
          cancelButton: "sweet-alert-cancel-button-cancel",
        },
        buttonsStyling: false,
        cancelButtonText: "Login / Sign up",
        confirmButtonText: "Continue Booking As A Guest",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let response = await guest_login().unwrap();
            response.message && successMsg(response.message);
  
            await setCookies("origin_rent_token", response?.data?.token);
            await setCookies("origin_rent_userdata", JSON.stringify(response?.data));
            dispatch(langUpdate({
              lang: response?.data?.lang_id,
              lang_code: response?.data?.lang_code,
            }));
            dispatch(loggedIn(true));
            dispatch(userDataUpdate(response?.data));
  
            setTimeout(() => {
              let url = data?.data?.txn_id
                ? `/deal-booking?txn_id=${data?.data?.txn_id}&${queryString}`
                : `/deal-booking?${queryString}`;
              router.push(url);
            }, 100);
          } catch (error) {
            let err = error?.data?.message ? error?.data?.message : error.message;
            errorMsg(err);
          }
        } else {
          router.push(`/login?callbackUrl=deal-booking`);
        }
      });
    }
  };
  

  if (isLoading)
    return (
      <>
        <Header />
        <section className="hero mt-35">
          <div className="container loader-img-img" data-aos="fade-up">
            <img src="/assets/img/ball-triangle.svg" alt="img" />
          </div>
        </section>
      </>
    );

  const handleShowImportantInfo = () => {
    setImptinfo(true);
  };

  return (
    <>
      <Head>
        <title>Origin Rent </title>
        <meta
          name="description"
          content="Origin Rent is Car hire service platform for those users who need cars on rent."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/favicon.png" />
      </Head>
      <Header />
      {loginLoading && <div className="list-loader" />}
      <section className="hero mt-35">
        <div className="container" data-aos="fade-up">
          <div className="bnr-img">
            <img src="/assets/img/bnr-img.png" alt="" />
          </div>
          
          <div className="ovtr-box">
            <div
              className={`srch-bx ${showHeroSec ? "hide_travel_details" : ""}`}
            >
              <div className="d-flex w-100 align-items-center">
                <div className="srch-dth ">
                  <h3>{data?.data?.address?.pickup}</h3>
                  <p>
                    {moment(data?.data?.datetime?.pickup_datetime).format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </p>
                </div>
                <div className="col-lg-2 col-md-1 text-center">
                  <img src="/assets/img/errow-nxt.svg" alt="" />
                </div>
                <div className="srch-dth">
                  <h3>{data?.data?.address?.dropoff}</h3>
                  <p>
                    {moment(data?.data?.datetime?.return_datetime).format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </p>
                </div>
              </div>
              <div className="col-lg-5 col-md-3 text-end">
                <button
                  className="edt-btn"
                  onClick={() => setShowHeroSec(true)}
                >
                  {staticData?.data?.edit}
                </button>
              </div>
            </div>

            <ListForm
              setShowHeroSec={setShowHeroSec}
              showHeroSec={showHeroSec}
              isFetching={false}
              transactionId={data?.data?.txn_id ? data?.data?.txn_id : null}
            />
          </div>
        </div>
      </section>

      <main id="main">
        <section id="cr-lst" className="cr-lst pt-0">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="col-lg-9 col-md-12">
                <div className="car-pr-sct shadow-none">
                  <div className="row">
                    {data?.data?.car?.length > 0 && (
                      <>
                        <div className="col-md-3">
                          <img
                            className="img-fluid"
                            src={
                              data?.data?.car[0]?.car_image
                                ? data?.data?.car[0]?.car_image
                                : "/assets/img/car-9.png"
                            }
                            alt=""
                          />
                        </div>
                        <div className="col-md-9">
                          <div className="cr-dtl">
                            <h4>{data?.data?.car[0]?.car_name}</h4>
                            {/* <p>or similar estate car</p> */}
                            <div className="spciftn border-0 ">
                              <ul>
                                {data?.data?.car[0]?.car_seat && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/car-seat.svg"
                                      alt=""
                                    />{" "}
                                    {data?.data?.car[0]?.car_seat} seats
                                  </li>
                                )}
                                {data?.data?.car[0]?.car_transmission && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/gear.svg"
                                      alt=""
                                    />{" "}
                                    {data?.data?.car[0]?.car_transmission}
                                  </li>
                                )}
                                {data?.data?.car[0]?.luggageLarge && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/sport-bag.svg"
                                      alt=""
                                    />{" "}
                                    {data?.data?.car[0]?.luggageLarge} Large
                                    bags
                                  </li>
                                )}
                                {data?.data?.car[0]?.luggageMed && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/camera-bag.svg"
                                      alt=""
                                    />
                                    {data?.data?.car[0]?.luggageMed}{" "}
                                    {"Medium bags"}
                                  </li>
                                )}
                                {data?.data?.car[0]?.luggageSmall && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/camera-bag.svg"
                                      alt=""
                                    />{" "}
                                    {data?.data?.car[0]?.luggageSmall} Small bag
                                  </li>
                                )}
                                {data?.data?.car[0]?.car_mileage && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/speedometer.svg"
                                      alt=""
                                    />{" "}
                                    {data?.data?.car[0]?.car_mileage}
                                  </li>
                                )}
                              </ul>
                            </div>
                            <h5>
                              <img src="/assets/img/location.svg" alt="" />{" "}
                              {data?.data?.address?.pickup}{" "}
                              {/* <span>- Shuttle Bus</span> */}
                            </h5>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="accordion" id="accordionExample">
                      {
                        data?.data?.eurocar_insurance && (

                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Step 1: Choose your package
                              </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                                <div className="">
                                  <div className="row align-items-start">
                                    {
                                      (
                                        <>
                                        
                                                  {eurocar_insurance.map((item) => (
                                                    <>
                                                      <div className="col-md-4">
                                            <div className="price-cards">
                                              <div className="ml-4 d-block">
                                                <div className="price-card h-100 row-price-card">
                                                      <h5 className="title text-center">{item.code}</h5>

                                                      <ul className="product-details mb-4 mt-4">
                                                      <li><span className="w-8 text-center icon">
                                                          <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                          <span>Excess liability {item.excessWithPOM}</span>
                                                        </li>
                                                        <li><span className="w-8 text-center icon">
                                                          <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                          <span>{item.code_title}</span>
                                                        </li>
                                   
                                                        <li><span className="w-8 text-center icon">
                                                          <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                          <span>Fuel policy Like for Like {item.code}</span>
                                                        </li>
                                                        <li><span className="w-8 text-center icon"><span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                          Security deposit
                                                          <span><strong> {currency_symbol} {item.price}</strong></span></span>
                                                          </li>

                               
                                                      </ul>
                                                      <p style={{ 'textAlign': 'center' }}><strong>{currency_symbol} {item.price}</strong></p>
                                                      {/* {item.code === 'WWI' ? (
                                                        <button type="button" className="btn_book disable_book_btn">Selected</button>
                                                      ) : (
                                                        // <button className="btn_book" onClick={() => handleRedirect('WWI')}>Select</button>
                                                        <button 
  className="btn_book" 
  onClick={() => {
    console.log('Item data:', item); // Log the entire item object
    handleRedirect(item.code, item.price);
  }}
>
  Select
</button>

                                                      )} */}
                                                      {selectedCode === item.code ? (
  <button type="button" className="btn_book disable_book_btn">Selected</button>
) : (
  <button 
    className="btn_book" 
    onClick={() => {
      console.log('Item data:', item);
      handleRedirect(item.code, item.price);
    }}
  >
    Select
  </button>
)}

                                                      
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                                    </>
                                                  ))}



                                        </>
                                      )
                                    }

                      

                                    {
                                      data?.data?.car[0].car_product.PMP && (
                                        <>
                                          <div className="col-md-4" style={{ 'marginTop': '10px' }}>
                                            <div className="price-cards">
                                              <div className="ml-4 d-block">
                                                <div className="price-card h-100 row-price-card">
                                                  <h5 className="title text-center"><img src="https://booking.greenmotion.com/images/vehicle-listing/premium-plus-badge.svg" alt="" /></h5>
                                                  <ul className="product-details mb-4 mt-4">
                                                    <li><span className="w-8 text-center icon">

                                                      <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                        Excess liability <span><strong> {currency_symbol} {data?.data?.car[0].car_product.PMP.excess}</strong></span></span>
                                                    </li>

                                                    <li><span className="w-8 text-center icon"><span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                      Security deposit
                                                      <span><strong> {currency_symbol} {data?.data?.car[0].car_product.PMP.deposit}</strong></span></span></li>

                                                    <li><span className="w-8 text-center icon">
                                                      <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                      <span>Fuel policy Like for Like ({data?.data?.car[0].car_product.PMP.fuelpolicy}) </span>
                                                    </li>

                                                    <li><span className="w-8 text-center icon">
                                                      <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                      <span>{data?.data?.car[0].car_product.PMP.mileage} free km per rental</span>
                                                    </li>

                                                    <li><span className="w-8 text-center icon">
                                                      <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                      <span>Cancellation in line with <span className="tc_popup" onClick={handleShowImportantInfo} >T&Cs</span></span>
                                                    </li>

                                                    <li><span className="w-8 text-center icon">
                                                      <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                      <span>Glass and tyres covered</span>
                                                    </li>


                                                  </ul>

                                                  <p style={{ 'textAlign': 'center' }}>
                                                  <strong>
                                                    {currency_symbol} {data?.data?.car[0]?.grandTotal ? round(data?.data?.car[0].grandTotal) : 0}
                                                  </strong>
                                                </p>
                                                  {selected_pack === 'PMP' ? (
                                                    <button type="button" className="btn_book disable_book_btn">Selected</button>
                                                  ) : (
                                                    <button className="btn_book" onClick={() => handleRedirect('PMP')}>Select</button>
                                                  )}

                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        )
                      }

                      {/* {
                        eurocar_equipment != undefined && (
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                Step 2: Choose your additional options
                              </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                                <div>
                                  <ul className="extra_ul">
                                    {eurocar_equipment?.map((res, i) => (
                                      <li className={isActive === res.code && 'active'} onClick={() => handleSetExtraData(res)}>
                                        <div>{currency_symbol}{res.price}</div>
                                        <div> {res.equipment_detail}</div>
                                        
                                      </li>
                                    ))}
                                  </ul>
                     
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      } */}
                      {eurocar_equipment != undefined && (
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingTwo">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
        Step 2: Choose your additional options
      </button>
    </h2>
    <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <div>
          <ul className="extra_ul">
            {eurocar_equipment?.map((res) => (
              <li 
                key={res.code} 
                className={selectedExtras.some(extra => extra.code === res.code) ? 'active' : ''} 
                onClick={() => handleSetExtraData(res)}
              >
                <div>{currency_symbol}{res.price}</div>
                <div>{res.equipment_detail}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Selected Additional Options:</h3>
          <ul>
            {selectedExtras.map(extra => (
              <li key={extra.code}>
                {extra.equipment_detail} - {currency_symbol}{extra.price}
              </li>
            ))}
          </ul>
          <span className="total-value">
            Total for Additional Options: {currency_symbol}{selectedExtras.reduce((total, extra) => total + Number(extra.price), 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
)}


                    </div>


                    <div className="col-md-12 car-onr">
                      <div className="enqry">
                        <div className="wch-lg" style={{ borderRight: "none" }}>
                          {data?.data?.car[0]?.supplier_id == "35" ? (
                            <img src="/assets/img/green_motion.png" alt="" />
                          ) : (
                            <img src={data?.data?.car[0]?.vendor_logo} alt="" />
                          )}
                        </div>
                    
                      </div>
               
                    </div>
                  </div>
                </div>
               
                <div className="insur-policy">
                  <h4>{data?.data?.insurance?.insurance_title}</h4>
                  <p>
                    <div dangerouslySetInnerHTML={{ __html: data?.data?.insurance?.insurance_short_description }}></div>
              
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-12">
                <div className="pick-lcton">
                  <h3>{staticData?.data?.pickup_and_dropoff}</h3>
                  <div className="col-md-12 d-flex align-items-center">
                    <span>
                      <img
                        src="assets/img/from-to.svg"
                        alt=""
                        className="img-fluid"
                      />
                    </span>
                    <div className="loctn">
                      <h4>
                        <span>{staticData?.data?.pickup_point}</span>
                        {data?.data?.address?.pickup}
                        <span className="mt-1">
                          {moment(data?.data?.datetime?.pickup_datetime).format(
                            "DD MMM YYYY HH:mm"
                          )}
                        </span>
                      </h4>
                      <hr />
                      <img
                        className="up-dn-lcton"
                        src="./assets/img/lcton-chnge.svg"
                        alt=""
                      />
                      <h4>
                        <span>{staticData?.data?.dropoff_point}</span>
                        {data?.data?.address?.dropoff}
                        <span className="mt-1">
                          {moment(data?.data?.datetime?.return_datetime).format(
                            "DD MMM YYYY HH:mm"
                          )}
                        </span>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="pick-lcton">
                <h3>{staticData?.data?.price_breakdown}</h3>

<p>
  {staticData?.data?.car_rental_price}{" "}
  <span>
    {currency_symbol + Math.round(data?.data?.car[0]?.car_total_pricing * 100) / 100}
    {/* {currency_symbol + Math.round((data?.data?.car[0]?.car_total_pricing + selectedCodePrice) * 100) / 100} */}

  </span>
</p>

<hr />

{extra_rate > 0 ? (
  <div>
    <p className="prm-aply">
      Extra{" "}
      <span>{currency_symbol + Math.round(extra_rate * 100) / 100}</span>
    </p>
    <hr />
  </div>
) : null}

{/* <p>
  {staticData?.data?.price_for + " " + data?.data?.car[0]?.days + " " + staticData?.data?.days}
  :{" "}
  <span>
    {currency_symbol} {isActive ? totalPrice : roundNum(data?.data?.car[0]?.grandTotal)}
  </span>
</p> */}

<p>
  {staticData?.data?.price_for + " " + data?.data?.car[0]?.days + " " + staticData?.data?.days}:
  <span>
    {currency_symbol} {isActive ? totalPrice : roundNum(Number(data?.data?.car[0]?.grandTotal || 0) + Number(selectedCodePrice || 0) + selectedExtras.reduce((total, extra) => total + Number(extra.price), 0))}
  </span>
</p>

<span className="total-value">
  Selected Service: {selectedCode} (Price: {currency_symbol}{selectedCodePrice}) 
  <br />
  {selectedExtras.length > 0 && (
    <div>
      Additional Services:
      <ul>
        {selectedExtras.map(extra => (
          <li key={extra.code}>
            {extra.equipment_detail} (Price: {currency_symbol}{extra.price})
          </li>
        ))}
      </ul>
    </div>
  )}
  <br />
  Total: {currency_symbol} {roundNum(Number(data?.data?.car[0]?.grandTotal || 0) + Number(selectedCodePrice || 0) + selectedExtras.reduce((total, extra) => total + Number(extra.price), 0))}
</span>


                  <hr />


                  <div className="book-protection">
                  
                    <a className="fil-btn" onClick={() => goToBooking(0)}>
                      {staticData?.data?.go_to_book}{" "}
                    </a>
     
                  </div>


                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {showImptinfo && (
        <ImportantInfo
          showImptinfo={showImptinfo}
          popupdata={data?.data?.term_conditions_data}
          handleCloseImptInfo={handleCloseImptInfo}
        />
      )}
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res, resolvedUrl } = context;
  const query = context.query ? context.query?.txn_id : null;
  const procode = context.query ? context.query?.procode : null;
  const search_id = context.query ? context.query?.search_id : null;
  let userData = await req.cookies.origin_rent_userdata;
  let token = await req.cookies.origin_rent_token;

  return {
    props: {
      txn_id: query ? query : null,
      token: token ? token : null,
      procode: procode ? procode : null,
      search_id: search_id ? search_id : null,
      userData: userData ? JSON.parse(userData) : null,
    },
  };
};
export default DealDetail;


