import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import {
  Chart as ChartJS,
  CategoryScale,
  LineController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Loading from "@/components/Loading";

export default function Home() {
  const { data: session, status } = useSession();

  const router = useRouter();
  // check if there is no active session and redirect to login page
  useEffect(() => {
    // check if there is no active session and redirect to login page
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (status === "loading") {
    // loading state, loader or any other indicator
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h2>Loading...</h2>
      </div>
    );
  }

  ChartJS.register(CategoryScale, LineController, LinearScale, BarElement, Title, Tooltip, Legend);

  // Use this on top for render error
  const [blogsData, setBlogsData] = useState([]);

  // Define options within the component
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Bloggar Skapade Månadsvis Per År"
      }
    }
  };

  useEffect(() => {
    // Fetch data from api
    const fetchData = async () => {
      try {
        const response = await fetch("/api/blogapi");
        const data = await response.json();
        setBlogsData(data); // Assuming data is an array of the blog oject
      } catch (error) {
        console.error("Error fetching data.", error);
      }
    };
    fetchData();
  }, []);

  // Aggregate data by year and month
  const monthlydata = blogsData
    .filter((dat) => dat.status === "publish")
    .reduce((acc, blog) => {
      const year = new Date(blog.createdAt).getFullYear(); // Get the year
      const month = new Date(blog.createdAt).getMonth(); // Get the month (0 indexed)
      acc[year] = acc[year] || Array(12).fill(0); // Initialize array for the year if not exists

      acc[year][month]++; // Increment count for the month
      return acc;
    }, {});

  const currentYear = new Date().getFullYear(); // Get the current year
  const years = Object.keys(monthlydata);
  const labels = [
    "Januari",
    "Februari",
    "Mars",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "Augusti",
    "September",
    "Oktober",
    "November",
    "December"
  ];

  const datasets = years.map((year) => ({
    label: `${year}`,
    data: monthlydata[year] || Array(12).fill(0), // If no data for a month, default to 0
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, 0.5)`
  }));

  const data = {
    labels,
    datasets
  };

  /* const totalCategories = blogsData.reduce((acc, blog) => acc + blog.blogcategory.length, 0);
  const totalTags = blogsData.reduce((acc, blog) => acc + blog.tags.length, 0); */
  const uniqueCategories = new Set();
  const uniqueTags = new Set();

  blogsData.forEach((blog) => {
    blog.blogcategory.forEach((category) => uniqueCategories.add(category));
    blog.tags.forEach((tag) => uniqueTags.add(tag));
  });

  const totalCategories = uniqueCategories.size;
  const totalTags = uniqueTags.size;

  if (session) {
    return (
      <>
        <Head>
          <title>Admin Dashboard BMM</title>
          <meta name="description" content="admin dashboard next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="dashboard">
          {/* title dashboard */}
          <div className="titledashboard flex flex-sb">
            <div data-aos="fade-right">
              <h2>
                Blogs <span>Dashboard</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb" data-aos="fade-right">
              <IoHome /> <span>/</span> <span>Dashboard</span>
            </div>
          </div>

          {/* dashboard four cards */}
          <div className="topfourcards flex flex-sb">
            <div className="four_card" data-aos="fade-right">
              <h2>Bloggar</h2>
              <span>{blogsData.filter((ab) => ab.status === "publish").length}</span>
            </div>
            <div className="four_card" data-aos="fade-right">
              <h2>Ämnen</h2>
              <span>{totalCategories}</span>
            </div>
            <div className="four_card" data-aos="fade-left">
              <h2>Taggar</h2>
              <span>{totalTags}</span>
            </div>
            <div className="four_card" data-aos="fade-left">
              <h2>Utkast</h2>
              <span>{blogsData.filter((ab) => ab.status === "draft").length}</span>
            </div>
          </div>

          {/* year overview */}
          <div className="year_overview flex flex-sb">
            <div className="leftyearoverview" data-aos="fade-up">
              <div className="flex flex-sb">
                <h3>Year Overview</h3>
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <div className="small-dot"></div>
                </ul>
                <h3 className="text-right">
                  10 / 365 <br /> <span>Total Published</span>
                </h3>
              </div>
              <Bar data={data} options={options} />
            </div>
            <div className="right_salescont" data-aos="fade-up">
              <div>
                <h3>Content Categories</h3>
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <div className="small-dot"></div>
                </ul>
              </div>
              <div className="blogscategory flex flex-center">
                <table>
                  <thead>
                    <tr>
                      <td>Topics</td>
                      <td>Data</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Drum Sets</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>Accessories</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>Sound</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>Hot Topics</td>
                      <td>10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
