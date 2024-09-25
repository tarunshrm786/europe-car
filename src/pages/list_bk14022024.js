import Head from "next/head";
import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import _debounce from "lodash/debounce";
import { useRef, useState } from "react";
import { Placeholder } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Slider } from "antd";

import {
  useSearchVehicalQuery,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import {
  getCookieData,
  roundNum,
  setCookies,
  uniqueNumber,
} from "@/utils/helper";
import Carousel from "@/components/Carousel";
import titleCase from "@/components/TitleCase";

import ListForm from "@/components/List";
import CarNotFound from "@/components/CarNotFound";
import { listSearching, updateFetching } from "@/store/Slices/headerSlice";
import RBmodal from "@/components/Modal/RBmodal";
import ImportantInfo from "@/components/List/ImportantInfo";
import FilterModal from "@/components/List/FilterModal";
import Header from "@/components/Header";

// import Loader from "assets/ball-triangle.svg"
const List = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  let btnRef = useRef(0);
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });
  let dataForSearch =
    getCookieData("searchData") && JSON.parse(getCookieData("searchData"));
  const [showHeroSec, setShowHeroSec] = useState(false);
  const [showImptinfo, setImptinfo] = useState(false);
  const [showFilter, setFilter] = useState(false);
  const [showTCpopup, setTCpopup] = useState(false);
  const [carSpecs, setCarSpecs] = useState({});
  const [carFuel, setCarFuel] = useState([]);
  const [mileageFilter, setMileageFilter] = useState([]);
  const [carBrandFilter, setCarBrandFilter] = useState([]);
  const [transmissionFilter, setTransmissionFilter] = useState([]);
  const [seatFilter, setseatFilter] = useState([]);
  const [carCatFilter, setCarCatFilter] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [minMax, setMinMax] = useState([0, 0]);
  const [depositminMax, setDepositMinMax] = useState([0, 0]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [dopminPrice, setdopMinPrice] = useState(0);
  const [dopmaxPrice, setdopMaxPrice] = useState(0);
  const [cardata, setcardata] = useState([]);

  const {
    currency,
    lang,
    currency_symbol,
    fetching,
    carSearching,
    prev_currency,
  } = useSelector((state) => state.headData);

  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

  const handleCloseImptInfo = () => setImptinfo(false);
  const handleCloseFilter = () => setFilter(false);
  const handleCloseTCpopup = () => setTCpopup(false);

  let transactionId = props?.txn_id;
  console.log("props :", props);
  let queryUrl = "";

  if (Object.keys(carSpecs).length > 0) {
    queryUrl += `airCondition=${carSpecs["airCondition"]}&`;
  }
  if (carFuel.length > 0) {
    queryUrl += `car_fuel=${carFuel.toString()}&`;
  }
  if (mileageFilter.length > 0) {
    queryUrl += `mileage=${mileageFilter.toString()}&`;
  }
  if (carBrandFilter.length > 0) {
    queryUrl += `car_brand=${carBrandFilter.toString()}&`;
  }
  if (transmissionFilter.length > 0) {
    queryUrl += `car_transmission=${transmissionFilter.toString()}&`;
  }
  if (carCatFilter.length > 0) {
    queryUrl += `car_category=${carCatFilter.toString()}&`;
  }
  if (sortBy) {
    queryUrl += `price=${sortBy}`;
  }
  if (maxPrice > 0) {
    queryUrl += `min_price=${minPrice}&max_price=${maxPrice}`;
  }

  if (dopmaxPrice > 0) {
    queryUrl += `dopmin_price=${dopminPrice}&dopmax_price=${dopmaxPrice}`;
  }

  if (seatFilter.length > 0) {
    queryUrl += `car_seat=${seatFilter.toString()}&`;
  }

  

  const {
    data: carListData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useSearchVehicalQuery(
    {
      data: {
        ...dataForSearch,
        ...(props.userdata &&
          props.userdata?.role_id == "3" && { partner_id: props.userdata.id }),
        ...(props.userdata && { userId: props.userdata.id }),
        ...(currency && { currency_id: currency }),
        ...(prev_currency && { prev_currency: prev_currency }),
        lang_id: lang,
      },
      queryUrl,
    },
    { refetchOnMountOrArgChange: true }
  );


  const handleCarSpaces = (e) => {
    dispatch(updateFetching(true));
    let target = e.target;
    let name = target.name;
    if (target.checked) {
      setCarSpecs((prev) => ({ ...prev, [name]: "yes" }));
    } else {
      setCarSpecs({});
    }
  };
  if (!isFetching) {
    dispatch(updateFetching(false));
    dispatch(listSearching(false));
  }

  const handleEleCar = (e) => {
    dispatch(updateFetching(true));
    let target = e.target;
    let name = target.name;

    if (target.checked) {
      setCarFuel((prev) => [...prev, name]);
    } else {
      const removeData = carFuel.filter((res) => res !== name);
      setCarFuel(removeData);
    }
  };
  const handleMileageFilter = (e) => {
    dispatch(updateFetching(true));
    let target = e.target;
    let name = target.name;

    if (target.checked) {
      setMileageFilter((prev) => [...prev, name]);
    } else {
      const removeData = mileageFilter.filter((res) => res !== name);
      setMileageFilter(removeData);
    }
  };
  const handleCarBrandFilter = (e) => {
    dispatch(updateFetching(true));
    let target = e.target;
    let name = target.name;
    if (target.checked) {
      setCarBrandFilter((prev) => [...prev, name]);
    } else {
      const removeData = carBrandFilter.filter((res) => res !== name);
      setCarBrandFilter(removeData);
    }
  };
  const handleTransmissionFilter = (e) => {
    dispatch(updateFetching(true));
    let target = e.target;
    let name = target.name;
    if (target.checked) {
      setTransmissionFilter((prev) => [...prev, name]);
    } else {
      const removeData = transmissionFilter.filter((res) => res !== name);
      setTransmissionFilter(removeData);
    }
  };

  const handleseatFilter = (e) => {
    // dispatch(updateFetching(true));
    let target = e.target;
    let value = target.value;
    if (target.checked) {
      setseatFilter((prev) => [...prev, value]);
    } else {
      const removeData = seatFilter.filter((res) => res !== value);
      setseatFilter(removeData);
    }
  };

  const handleCarCatFilterFilter = (e) => {
    dispatch(updateFetching(true));
    let target = e.target;
    let name = target.name;
    if (target.checked) {
      setCarCatFilter([name]);
    } else {
      const removeData = carCatFilter.filter((res) => res !== name);
      setCarCatFilter(removeData);
    }
  };

  const handleRedirect = async (carId , pro_code , insertedId) => {
    // router.push("/deal-detail");
    await setCookies("dealCarId", carId);
    await setCookies("proCode", pro_code);
    await setCookies("inserted_id", insertedId);

    setTimeout(() => {
      let sendURL = transactionId
        ? `/deal-detail?txn_id=${transactionId}`
        : "/deal-detail";
      router.push(sendURL);
    }, 500);
  };

  const handleClearFilter = () => {
    setCarSpecs({});
    setCarFuel([]);
    setMileageFilter([]);
    setTransmissionFilter([]);
    setCarCatFilter([]);
    setCarBrandFilter([]);
    setMinPrice(0);
    setMaxPrice(0);
    setdopMinPrice(0);
    setdopMaxPrice(0);
    setMinMax([0, 0]);
    setseatFilter([]);
  };

  // if (isLoading)
  //   return (
  //     <section className="hero mt-35">
  //       <div className="container loader-img-img" data-aos="fade-up">
  //         <img src="/assets/img/ball-triangle.svg" alt="img" />
  //       </div>
  //     </section>
  //   );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow:
      carListData?.data?.car_category?.length > 4
        ? 4
        : carListData?.data?.car_category?.length,
    arrows: false,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow:
            carListData?.data?.car_category?.length > 3
              ? 3
              : carListData?.data?.car_category?.length,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow:
            carListData?.data?.car_category?.length > 3
              ? 3
              : carListData?.data?.car_category?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleShowImportantInfo = () => {
    setImptinfo(true);
  };

  const handleFilterMobile = () => {
    setFilter(true);
  };
  const handleTCpopup = () => {
    setTCpopup(true);
  };

  const handleGeneratePDF = async () => {
    const response = `${process.env.NEXT_PUBLIC_PDF_BASE_URL}/search-car-pdf?
        pickup_location=${dataForSearch?.pickup_location}&return_location=${dataForSearch?.return_location}
        &pickup_datetime=${dataForSearch?.pickup_datetime}&return_datetime=${dataForSearch?.return_datetime}&lang_id=${lang}&currency_id=${currency}&unique_time=${dataForSearch.unique_time}`;

    const link = document.createElement("a");
    link.href = response;
    link.setAttribute("target", "_blank");
    // Append to html link element page
    document.body.appendChild(link);
    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  };

  const debounceFn = useCallback(_debounce(handleDebounceFn, 1000), []);
  const debounceFn_dep = useCallback(_debounce(handleDebounceFn_dep, 1000), []);

  function handleDebounceFn_dep(prices) {
    setdopMinPrice(prices[0]);
    setdopMaxPrice(prices[1]);
    setDepositMinMax(prices);

  }

  function handleDebounceFn(prices) {
    setMinPrice(prices[0]);
    setMaxPrice(prices[1]);
    setMinMax(prices);
  }

  // Price Range onchange Function
  const handlePriceRange = (price) => {
    debounceFn(price);
    setMinMax(price);
  };

  const handleCarDepositRange = (price) =>{
        debounceFn_dep(price);
        console.log(price);
        setDepositMinMax(price);
  }

  if (isError) {
    return (
      <>
        <Header pathname={props.pathname} />
        <CarNotFound error={error.data} />
      </>
    );
  }
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
      <Header pathname={props.pathname} />
      {carSearching && isFetching && <div className="list-loader" />}
      <section className="hero py-3  ser-fltr">
        <div className="container" data-aos="fade-up">
          {/* <div className="bnr-img">
            <img src="/assets/img/bnr-img.png" alt="" />
          </div> */}
          <div className="ovtr-box">
            <div
              className={`srch-bx ${showHeroSec ? "hide_travel_details" : ""}`}
            >
              <div className="d-flex w-100 align-items-center">
                {isLoading ? (
                  <div className={`srch-dth `}>
                    <h3>{props.searchData?.pickup_location}</h3>
                    <p>{props.searchData?.pickup_datetime}</p>
                  </div>
                ) : (
                  <div className={`srch-dth `}>
                    <h3>{carListData?.data?.address?.pickup}</h3>
                    <p>{carListData?.data?.datetime?.pickup_datetime}</p>
                  </div>
                )}
                <div className="col-lg-2 col-md-1 text-center">
                  <img src="/assets/img/errow-nxt.svg" alt="" />
                </div>
                {isLoading ? (
                  <div className="srch-dth">
                    <h3>
                      {props.searchData?.return_location
                        ? props.searchData?.return_location
                        : props.searchData?.pickup_location}
                    </h3>
                    <p>{props.searchData?.return_datetime}</p>
                  </div>
                ) : (
                  <div className="srch-dth">
                    <h3>{carListData?.data?.address?.dropoff}</h3>
                    <p>{carListData?.data?.datetime?.return_datetime}</p>
                  </div>
                )}
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

            {!isLoading && (
              <ListForm
                setShowHeroSec={setShowHeroSec}
                showHeroSec={showHeroSec}
                isFetching={isFetching}
              />
            )}
            <div className="location-qty">
              <h3 className="dtl-tle">
                {titleCase(carListData?.data?.address?.pickup)}:{" "}
                {carListData?.data?.cars?.length}{" "}
                {staticData?.data?.car_on_availabe}
                <span
                  type="button"
                  // data-bs-toggle="modal"
                  // data-bs-target="#fltrmdl"
                  onClick={handleFilterMobile}
                >
                  {staticData?.data?.filter}
                </span>
              </h3>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <>
          <div className="list-loader" />
          <main id="main">
            <section id="cr-lst" className="cr-lst pt-0">
              <div className="container" data-aos="fade-up">
                <Placeholder as="p" animation="glow">
                  <Placeholder
                    xs={12}
                    style={{
                      height: "40vh",
                      borderRadius: "15px",
                      textAlign: "center",
                      background: "#d5cece",
                    }}
                  />
                </Placeholder>
              </div>
            </section>
          </main>
        </>
      ) : (
        <main id="main">
          <section id="cr-lst" className="cr-lst pt-0">
            <div className="container" data-aos="fade-up">
              <div className="row">
                <div className="col-md-3 mbl-none">
                  <aside className="flter-car">
                    <h3>
                      {staticData?.data?.filter}{" "}
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={handleClearFilter}
                      >
                        {staticData?.data?.clear}
                      </a>
                    </h3>
                    {/* <ul className="fltr-che">
                    <h5>Location (Heathrow Airport)</h5>
                    <li>
                      <input type="checkbox" defaultChecked /> Airport (meet &
                      greet)
                    </li>
                    <li>
                      <input type="checkbox" />
                      Airport (shuttle)
                    </li>
                  </ul> */}

                    <ul className="fltr-che">
                      <h5>{staticData?.data?.price}</h5>
                      <Slider
                        range
                        min={0}
                        max={3000}
                        marks={{ 0: `0`, 3000: `3000+` }}
                        value={minMax}
                        onChange={handlePriceRange}
                      />
                    </ul>

                    {carListData?.data["car_deposit"] &&
                    Object.keys(carListData?.data["car_deposit"]).length >
                      0 ? (
                      <ul className="fltr-che">
                        <h5>Deposit Amount</h5>
                        <Slider
                          range
                          min={0}
                          max={3000}
                          marks={{ 0: `0`, 3000: `3000+` }}
                          value={depositminMax}
                          onChange={handleCarDepositRange}
                        />
                      </ul>
                    ) : null}

                    {carListData?.data["car-spaces-lang"] &&
                    Object.keys(carListData?.data["car-spaces-lang"]).length >
                      0 ? (
                      <ul className="fltr-che">
                        <h5>{carListData?.data?.filter_title?.car_specs}</h5>
                        {Object.keys(carListData?.data["car-spaces-lang"])?.map(
                          (res, i) => (
                            <li key={res.id}>
                              <input
                                type="checkbox"
                                name={res}
                                checked={carSpecs.hasOwnProperty(res)}
                                onChange={handleCarSpaces}
                              />{" "}
                              {carListData?.data["car-spaces-lang"][res]}
                            </li>
                          )
                        )}
                      </ul>
                    ) : null}
                    {carListData?.data["electric-car-lang"] &&
                    Object.keys(carListData?.data["electric-car-lang"]).length >
                      0 ? (
                      <ul className="fltr-che">
                        <h5>{carListData?.data?.filter_title?.car_fuel}</h5>
                        {Object.keys(
                          carListData?.data["electric-car-lang"]
                        )?.map((res, i) => (
                          <li key={res.id}>
                            <input
                              type="checkbox"
                              name={res}
                              checked={carFuel.includes(res)}
                              onChange={handleEleCar}
                            />{" "}
                            {carListData?.data["electric-car-lang"][res]}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {carListData?.data["mileage_lang"] &&
                    Object.keys(carListData?.data["mileage_lang"]).length >
                      0 ? (
                      <ul className="fltr-che">
                        <h5>
                          {carListData?.data?.filter_title?.mileage_kilometres}
                        </h5>
                        {Object.keys(carListData?.data["mileage_lang"])?.map(
                          (res, i) => (
                            <li key={res.id}>
                              <input
                                type="checkbox"
                                name={res}
                                checked={mileageFilter.includes(res)}
                                onChange={handleMileageFilter}
                              />{" "}
                              {carListData?.data["mileage_lang"][res]}
                            </li>
                          )
                        )}
                      </ul>
                    ) : null}
                    {carListData?.data["car_brand_lang"] &&
                    Object.keys(carListData?.data["car_brand_lang"]).length >
                      0 ? (
                      <ul className="fltr-che">
                        <h5> {carListData?.data?.filter_title?.car_brand}</h5>
                        {Object.keys(carListData?.data["car_brand_lang"])?.map(
                          (res, i) => (
                            <li key={res.id}>
                              <input
                                type="checkbox"
                                name={res}
                                checked={carBrandFilter.includes(res)}
                                onChange={handleCarBrandFilter}
                              />{" "}
                              {carListData?.data["car_brand_lang"][res]}
                            </li>
                          )
                        )}
                      </ul>
                    ) : null}
                    {carListData?.data["transmission_lang"] &&
                    Object.keys(carListData?.data["transmission_lang"]).length >
                      0 ? (
                      <ul className="fltr-che">
                        <h5>{carListData?.data?.filter_title?.transmission}</h5>
                        {Object.keys(
                          carListData?.data["transmission_lang"]
                        )?.map((res, i) => (
                          <li key={res.id}>
                            <input
                              type="checkbox"
                              name={res}
                              checked={transmissionFilter.includes(res)}
                              onChange={handleTransmissionFilter}
                            />{" "}
                            {carListData?.data["transmission_lang"][res]}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {carListData?.data["car_category_lang"] &&
                    Object.keys(carListData?.data["car_category_lang"]).length >
                      0 ? (
                      <ul className="fltr-che">
                        <h5>{carListData?.data?.filter_title?.car_category}</h5>
                        {Object.keys(
                          carListData?.data["car_category_lang"]
                        )?.map((res, i) => (
                          <li key={res.id}>
                            <input
                              type="checkbox"
                              name={res}
                              checked={carCatFilter.includes(res)}
                              onChange={handleCarCatFilterFilter}
                            />{" "}
                            {carListData?.data["car_category_lang"][res]}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {carListData?.data["car_seat"] &&
                    Object.keys(carListData?.data["car_seat"]).length >
                      0 ? (
                      <ul className="fltr-che">
                        <h5>{carListData?.data?.filter_title?.car_seat}</h5>
                        {Object.keys(
                          carListData?.data["car_seat"]
                        )?.map((res, i) => (
                          <li key={res.id}>
                            <input
                              type="checkbox"
                              name="car_seat"
                              value={carListData?.data["car_seat"][res]}
                              checked={seatFilter.includes(carListData?.data["car_seat"][res])}
                              onChange={handleseatFilter}
                            />{" "}
                            {carListData?.data["car_seat"][res]} Seat
                          </li>
                        ))}
                      </ul>
                    ) : <h1>Hello</h1>}

                  </aside>
                </div>
                <div className="col-lg-9 col-md-12">
                  <div className="pre-main">
                    <div className="sldr-cr-pre">
                      <Carousel settings={settings} btnRef={btnRef}>
                        {carListData?.data?.car_category?.map((res, i) => (
                          <div className="avlbe-car" key={res.id}>
                            <ul>
                              <li key={i}>
                                <img
                                  className="img-fluid"
                                  src={
                                    res.image
                                      ? res.image
                                      : "/assets/img/car-2.png"
                                  }
                                  alt=""
                                />

                                <input
                                  type="checkbox"
                                  name={res.title}
                                  checked={carCatFilter.includes(res.title)}
                                  onChange={handleCarCatFilterFilter}
                                />
                                <span></span>
                                <p>{res.title}</p>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </Carousel>
                    </div>
                    <div className="avlbe-car">
                      <ul>
                        {/* <button
                      className="pre-btn"
                      onClick={() => btnRef?.current?.slickPrev()}
                    >
                      <img src="/assets/img/sldr-errow.svg" alt="" />
                    </button> */}
                        {/* <button
                      className="next-btn"
                      onClick={() => btnRef?.current?.slickNext()}
                    >
                      <img src="/assets/img/sldr-errow.svg" alt="" />
                    </button> */}
                      </ul>

                      <div className="mp-srt">
                        <a
                          href={`https://www.google.com/maps/place/${carListData?.data?.address?.pickup}`}
                          target="_blank"
                        >
                          {staticData?.data?.view_on_map}
                        </a>
                        {/* <select
                          value={sortBy}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            dispatch(updateFetching(true));
                          }}
                        >
                          <option value="asc">Price -- Low to High</option>
                          <option value="desc">Price -- High to Low</option>
                        </select> */}

                        <div className="mt-2">
                          <button
                            className={
                              carListData?.data.cars?.length < 1
                                ? `edt-btn disabled-pdf`
                                : "edt-btn"
                            }
                            onClick={handleGeneratePDF}
                            disabled={carListData?.data.cars?.length < 1}
                          >
                            {staticData?.data?.genrate_pdf}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {carListData?.data.cars &&
                  carListData?.data.cars?.length > 0 ? (
                    carListData?.data.cars?.map((res, i) => 
                      isFetching && fetching ? (
                        <Placeholder as="p" animation="glow" key={i}>
                          <Placeholder
                            xs={12}
                            style={{
                              height: "20vh",
                              borderRadius: "15px",
                              textAlign: "center",
                              background: "#d5cece",
                            }}
                          />
                        </Placeholder>
                      ) : (
                        <div className="car-pr-sct" key={i}>
                          <div className="row new_row">
                            <div className="col-lg-5 col-md-12">
                            <h4 className="car_name">{res.car_name}</h4>

                              <img className="img-fluid" src={res.car_image? res.car_image: "/assets/img/car-9.png"}alt="" style={{'maxWidth':'200px'}} />

                            <div className="cr-dtl">
                              <div className="cr-prc-sct">
                               
          
                                {/* <h3>
                                {currency_symbol}
                                  {res.original_grandTotal
                                    ? roundNum(res.original_grandTotal)
                                    : 0}
                                    <span className="ms-2">
                                  {staticData?.data?.price_for +
                                    " " +
                                    res.days +
                                    " " +
                                    staticData?.data?.days}
                                  :
                                </span>
                                </h3> */}
                                
                               
                              </div>
                                {/* <p>or similar estate car</p> */}
                                <div className="spciftn spciftn_result">
                                  <ul>
                                    {res.car_seat && (
                                      <li>
                                        <img className="img-fluid" src="/assets/img/car-seat.svg" alt=""/>
                                        <h5>{res.car_seat}</h5>
                                      </li>
                                    )}
                                    {res.car_transmission && (
                                      <li>
                                        <img className="img-fluid" src="/assets/img/gear.svg" alt=""/>
                                       <h5>{res.car_transmission}</h5>
                                      </li>
                                    )}
                                    
                                      <li>
                                        <img className="img-fluid" src="/assets/img/sport-bag.svg" alt=""/>
                                        <h5>{res.luggageLarge && (<> {res.luggageLarge}{"L"} </>)}
                                        {res.luggageSmall && (<> {res.luggageSmall}{"S"} </>)}
                                        {res.luggageMed && (<> {res.luggageMed}{"M"} </>)}</h5>
                                        
                                      </li>
                                  
                                    {res.car_mileage?.length > 0 ||
                                    res.car_mileage ? (
                                      <li>
                                        <img
                                          className="img-fluid"
                                          src="/assets/img/speedometer.svg"
                                          alt=""
                                        />
                                        <h5>{res.car_mileage}</h5>
                                      </li>
                                    ) : null}

                                      {res.car_fuel?.length != '' ||
                                        res.car_fuel ? (
                                          <li>
                                            <img className="img-fluid" src="https://booking.greenmotion.com/images/specs-icons/fuel-type-icon.svg"
                                              alt="" />
                                            <h5>{res.car_fuel}</h5>
                                          </li>
                                        ) : null}



                                  </ul>
                                </div>
                                
                                {/* <h5 className="d-flex align-items-center justify-content-between">
                                  <span><img src="/assets/img/location.svg" alt="" />{" "}
                                  {carListData?.data?.address?.pickup}{" "}</span>
                    
                                  <button className="view-mdl" id="man-book" onClick={() => handleRedirect(res.car_id)}>
                                    {staticData?.data?.view_deals}
                                  </button> 
                                </h5> */}
                                
                              </div>

                            </div>
                            <div className="col-lg-7 col-md-12">

                              <div className="row">
                                {
                                  res.car_product.BAS && (
                                    <>
                                    <div className="col-md-6">
                                        <div className="price-cards">
                                        <div className="ml-4 d-block">
                                            <div className="price-card h-100 row-price-card">
                                              <h5 className="title text-center"><img src="https://booking.greenmotion.com/images/vehicle-listing/basic-badge.svg" alt=""/></h5>
                                              <ul className="product-details mb-4 mt-4">
                                                  <li><span className="w-8 text-center icon">

                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                  Excess liability <span><strong> {currency_symbol} {res.car_product.BAS.excess}</strong></span></span>
                                                  </li>

                                                <li><span className="w-8 text-center icon"><span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                Security deposit
                                                <span><strong> {currency_symbol} {res.car_product.BAS.deposit}</strong></span></span></li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Fuel policy Like for Like ({res.car_product.BAS.fuelpolicy})</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>{res.car_product.BAS.mileage} free km per rental</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-x.svg" /></span></span>
                                                  <span>Non refundable</span>
                                                </li>

                                              </ul>
                                               <p style={{'textAlign':'center'}}><strong>{currency_symbol} {res.car_product.BAS.grandTotal ? roundNum(res.car_product.BAS.grandTotal): 0}</strong></p>
                                              <button className="btn_book" onClick={() => handleRedirect(res.car_id , res.car_product.BAS.product_code , carListData?.data?.insertedId)} >{staticData?.data?.view_deals}</button>

                                            </div>
                                        </div>
                                      </div> 
                                      </div>
                                    </>
                                  )
                                }
                                
                                {
                                  res.car_product.PLU && (
                                    <>
                                    <div className="col-md-6">
                                        <div className="price-cards">
                                        <div className="ml-4 d-block">
                                            <div className="price-card h-100 row-price-card">
                                              <h5 className="title text-center"><img src="/assets/img/premium-plus-badge4.svg" alt=""/></h5>
                                              <ul className="product-details mb-4 mt-4">
                                                  <li><span className="w-8 text-center icon">

                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                  Excess liability <span><strong> {currency_symbol} {res.car_product.PLU.excess}</strong></span></span>
                                                  </li>

                                                <li><span className="w-8 text-center icon"><span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                Security deposit
                                                <span><strong> {currency_symbol} {res.car_product.PLU.deposit}</strong></span></span></li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Fuel policy Like for Like ({res.car_product.PLU.fuelpolicy})</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>{res.car_product.PLU.mileage} free km per rental</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-x.svg" /></span></span>
                                                  <span>Non refundable</span>
                                                </li>

                                              </ul>

                                              <p style={{'textAlign':'center'}}><strong>{currency_symbol} {res.car_product.PLU.grandTotal ? roundNum(res.car_product.PLU.grandTotal): 0}</strong></p>
                                            
                                              <button className="btn_book" onClick={() => handleRedirect(res.car_id , res.car_product.PLU.product_code , carListData?.data?.insertedId)} >{staticData?.data?.view_deals}</button>

                                            </div>
                                        </div>
                                      </div> 
                                      </div>
                                    </>
                                  )
                                }

                                {
                                  res.car_product.PRE && (
                                    <>
                                    <div className="col-md-6" style={{'marginTop':'10px'}}>
                                        <div className="price-cards">
                                        <div className="ml-4 d-block">
                                            <div className="price-card h-100 row-price-card">
                                              <h5 className="title text-center"><img src="/assets/img/premium-plus-badge3.svg" alt=""/></h5>
                                              <ul className="product-details mb-4 mt-4">
                                                  <li><span className="w-8 text-center icon">

                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                  Excess liability <span><strong> {currency_symbol} {res.car_product.PRE.excess}</strong></span></span>
                                                  </li>

                                                <li><span className="w-8 text-center icon"><span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                Security deposit
                                                <span><strong> {currency_symbol} {res.car_product.PRE.deposit}</strong></span></span></li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Fuel policy Like for Like ({res.car_product.PRE.fuelpolicy})</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>{res.car_product.PRE.mileage} free km per rental</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Cancellation in line with <span onClick={handleTCpopup} className="tc_popup">T&Cs</span></span>
                                                </li>

                                              </ul>

                                              <p style={{'textAlign':'center'}}><strong>{currency_symbol} {res.car_product.PRE.grandTotal ? roundNum(res.car_product.PRE.grandTotal): 0}</strong></p>
                                              
                                              <button className="btn_book" onClick={() => handleRedirect(res.car_id , res.car_product.PRE.product_code ,  carListData?.data?.insertedId)} >{staticData?.data?.view_deals}</button>
                                            </div>
                                        </div>
                                      </div> 
                                      </div>
                                    </>
                                  )
                                }

                                {
                                  res.car_product.PMP && (
                                    <>
                                    <div className="col-md-6" style={{'marginTop':'10px'}}>
                                        <div className="price-cards">
                                        <div className="ml-4 d-block">
                                            <div className="price-card h-100 row-price-card">
                                              <h5 className="title text-center"><img src="https://booking.greenmotion.com/images/vehicle-listing/premium-plus-badge.svg" alt=""/></h5>
                                              <ul className="product-details mb-4 mt-4">
                                                  <li><span className="w-8 text-center icon">

                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                  Excess liability <span><strong> {currency_symbol} {res.car_product.PMP.excess}</strong></span></span>
                                                  </li>

                                                <li><span className="w-8 text-center icon"><span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                Security deposit
                                                <span><strong> {currency_symbol} {res.car_product.PMP.deposit}</strong></span></span></li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Fuel policy Like for Like ({res.car_product.PMP.fuelpolicy}) </span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>{res.car_product.PMP.mileage} free km per rental</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Cancellation in line with <span onClick={handleTCpopup} className="tc_popup">T&Cs</span></span>
                                                </li>

                                              </ul>

                                              <p style={{'textAlign':'center'}}><strong>{currency_symbol} {res.car_product.PMP.grandTotal ? roundNum(res.car_product.PMP.grandTotal): 0}</strong></p>
                                             
                                              <button className="btn_book" onClick={() => handleRedirect(res.car_id , res.car_product.PMP.product_code , carListData?.data?.insertedId)} >{staticData?.data?.view_deals}</button>
                                            </div>
                                        </div>
                                      </div> 
                                      </div>
                                    </>
                                  )
                                }
                              </div>
                             
                            </div>

                            <div className="col-lg-3 col-md-12">
                              
                            </div>
                            <div className="col-md-12 car-onr">
                              <div className="enqry">
                                <div
                                  className="wch-lg"
                                  style={{ borderRight: "none" }}
                                >
                                  {res.supplier_id == "35" ? (
                                    <img
                                      src="/assets/img/green_motion.png"
                                      alt=""
                                    />
                                  ) : (
                                    <img src={res.vendor_logo} alt="" />
                                  )}
                                </div>
                                {/* <div className="rte-tle">
                                  <h3>{res.vendor_name}</h3>
                                </div> */}
                                {/* <div className="rte-tle">
                                <img src="/assets/img/star.svg" alt="" />
                                <h3>8.5</h3>
                              </div>
                              <div className="tle-re">
                                <h5>
                                  Very good <span>1000+ reviews</span>
                                </h5>
                              </div> */}
                              </div>

                              {props.userdata &&
                                carListData?.data?.isshowclient == "yes" && (
                                  <div className="imrt-mel">
                                    {res.supplier_id == "35" ? (
                                      <a className="me-4">{f("ORIGIN")}</a>
                                    ) : (
                                      <a className="me-4">{f("BROKER")}</a>
                                    )}
                                  </div>
                                )}
                              {/* <div className="imrt-mel">
                              <a
                                className="me-4"
                                onClick={handleShowImportantInfo}
                              >
                                <img src="/assets/img/info.svg" alt="" />{" "}
                                Important info
                              </a>
                              {/* <a
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                <img src="/assets/img/email.svg" alt="" /> Email
                                quote
                              </a> 
                            </div> */}
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <CarNotFound
                      error={{
                        message: staticData?.data?.car_not_found,
                        suggestion: queryUrl ? `Please clear the filter.` : "",
                      }}
                      size={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
      {showImptinfo && (
        <ImportantInfo
          showImptinfo={showImptinfo}
          handleCloseImptInfo={handleCloseImptInfo}
        />
      )}

      {showFilter && (
        <RBmodal show={showFilter} handleClose={handleCloseFilter} size="lg">
          <FilterModal
            handleClose={handleCloseFilter}
            carListData={carListData}
            handleClearFilter={handleClearFilter}
            carSpecs={carSpecs}
            carFuel={carFuel}
            mileageFilter={mileageFilter}
            carBrandFilter={carBrandFilter}
            transmissionFilter={transmissionFilter}
            carCatFilter={carCatFilter}
            handleCarSpaces={handleCarSpaces}
            handleEleCar={handleEleCar}
            handleMileageFilter={handleMileageFilter}
            handleCarBrandFilter={handleCarBrandFilter}
            handleCarCatFilterFilter={handleCarCatFilterFilter}
            handleTransmissionFilter={handleTransmissionFilter}
            staticData={staticData}
            minMax={minMax}
            handlePriceRange={handlePriceRange}
          />
        </RBmodal>
      )}

    {showTCpopup && (
      <RBmodal show={showTCpopup} handleClose={handleCloseTCpopup} size="lg">
       <div className="pmt-methd" id="pmt-mdl-1">
       <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
          <button
              type="button"
              className="btn-close clss"
              //   data-bs-dismiss="modal"
              //   aria-label="Close"
              onClick={handleCloseTCpopup}
            ></button>
          </div>
          <div className="modal-body">

          </div>
        </div>
        </div>
      </RBmodal>
      )}
      
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { req, res, resolvedUrl } = context;
  const query = context.query ? context.query?.txn_id : null;
  let userdata = await req.cookies.origin_rent_userdata;
  let searchData = await req.cookies.searchData;

  const forwarded = req.headers["x-forwarded-for"];

  let ip =
    typeof forwarded === "string"
      ? forwarded.split(/, /)[0]
      : req.socket?.remoteAddress;
  // let ip;
  // if (req.headers["x-forwarded-for"]) {
  //   ip = req.headers["x-forwarded-for"].split(",")[0];
  // } else if (req.headers["x-real-ip"]) {
  //   ip = req.connection.remoteAddress;
  // } else {
  //   ip = req.connection.remoteAddress;
  // }

  return {
    props: {
      txn_id: query ? query : null,
      userdata: userdata ? JSON.parse(userdata) : null,
      searchData: searchData ? JSON.parse(searchData) : null,
      ip: ip ? ip : null,
      pathname: resolvedUrl ? resolvedUrl : null,
    },
  };
};

export default List;
