import { useEffect, useState } from "react";
import { Container, Grid, Paper } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const ExcursionsPage = () => {
  const [filter, setFilter] = useState("");
  const [excursions, setExcursions] = useState([]);

  const location = useLocation();
  const params = location.search ? location.search : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const timeLocalOptions = {
    weekday: "short",
    year: "2-digit",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: undefined,
  };

  useEffect(() => {
    let cancel;

    const fetchData = async () => {
      try {
        let query;

        if (params && !filter) query = params;
        else query = filter;

        axios({
          method: "GET",
          url: `https://gallery-heroku.herokuapp.com/api/excursions${query}`,
          withCredentials: true,
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })
          .then(({ data }) => {
            setExcursions(data.data);
          })
          .catch((e) => console.log(e));
      } catch (e) {
        console.log(e);
        console.log(e?.response?.data);
      }
    };

    fetchData();

    return () => cancel();
  }, [filter, params]);

  return (
    <>
      <div className="page-wrapper">
        <Container
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "24px 0",
          }}
        >
          <h1 style={{ marginBottom: "15px" }}>Excursions Page</h1>
          <Grid container spacing={2}>
            {excursions?.map((excs) => (
              <Grid key={`grid-${excs._id}`} item lg={3} md={4} xs={2}>
                <Paper className="post-card">
                  <div className="post-card__image-wrapper">
                    <img className="post-card__image" src={excs.image} alt="" />
                  </div>
                  <div style={{ padding: "10px" }}>
                    <h2 style={{ paddingBottom: "10px" }}>{excs.name}</h2>
                    <span className="post-card__subheading">Place</span>
                    <span style={{ marginLeft: "5px" }}>{excs.place}</span>
                    <br />
                    <span className="post-card__subheading">Price</span>
                    <span style={{ marginLeft: "5px" }}>{excs.price}₴</span>
                    <br />
                    <span className="post-card__subheading">Start Date</span>
                    <span style={{ marginLeft: "5px" }}>
                      {new Date(excs.date).toLocaleString(
                        "uk-UK",
                        timeLocalOptions
                      )}
                    </span>
                    <br />
                    <p style={{ paddingBottom: "5px" }}>
                      {" "}
                      <i>{excs.content}</i>
                    </p>
                    <span>Comments:</span>
                    <div className="comment-section">
                      {excs.feedback.map((feedbackItem) => (
                        <>
                          <div key={feedbackItem._id}>
                            {feedbackItem.content}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </>
  );
};

export { ExcursionsPage };
