import { useEffect, useState } from "react";
import Layout from "../components/layout";
import AmountsByDates from "../components/chart/AmountByDates";
import Sidebar from "../components/event/sidebar";
import axios from "axios";

const EventChart = () => {
  const [data, setData] = useState<{
    amountsByDates: {
      date: string;
      amount: number;
    }[];
  }>();

  const getData = async () => {
    // const result = await axios.get<typeof data>(
    //   "http://localhost:5050/sales-orders/stats?sd=1997-01-01&ed=1997-01-31"
    // );
    const sample: typeof data = {
      amountsByDates: [
        {
          date: "2021-11-01",
          amount: 7,
        },
        {
          date: "2021-11-02",
          amount: 4,
        },
        {
          date: "2021-11-03",
          amount: 8,
        },
        {
          date: "2021-11-04",
          amount: 2,
        },
        {
          date: "2021-11-05",
          amount: 4,
        },
        {
          date: "2021-11-06",
          amount: 5,
        },
      ],
    };
    setData(sample);
    // setData(result.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout>
      <br></br>
      <br></br>
      <div className="d-flex justify-content-center">
        <Sidebar />
        <div style={{ width: "70%" }}>
          <h2 style={{ textAlign: "center" }}>일별 상담 예약건수</h2>
          {data && <AmountsByDates data={data.amountsByDates} />}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            width: "100px",
          }}
        ></div>
      </div>
    </Layout>
  );
};

export default EventChart;
