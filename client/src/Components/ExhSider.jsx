import { useEffect, useState } from "react";
import {
  TextField,
  Box,
  InputAdornment,
  Button,
  Switch,
  Stack,
  Typography,
  Checkbox,
  FormLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ClearIcon from "@mui/icons-material/Clear";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  LocalizationProvider,
  DateTimePicker as DatePicker,
} from "@mui/x-date-pickers";

import { createExhibition } from "../apiRequests/apiRequests";
import { pokeGlobal } from "../Reducers/pokeReducer";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const ExhSider = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const userId = useSelector((state) => state.user.currentUser.id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const noImageLink = "https://www.jquery-az.com/html/images/banana.jpg";

  const defaultExhibition = {
    name: "",
    content: "",
    theme: "",
    place: "",
    image: noImageLink,
    date: new Date(),
    endDate: new Date(),
    price: 0,
    status: 0,
    rating: 0,
  };

  const defaultSearchExhibition = {
    name: "",
    content: "",
    theme: "",
    place: "",
    status: false,
    rating: 0,
    approvalStatus: 0,
  };

  const [isSearch, setSearch] = useState(false);

  const [exhibition, setExhibition] = useState(defaultExhibition);
  const [searchExhibition, setSearchExhibition] = useState(
    defaultSearchExhibition
  );

  const handleChangeSearch = (e) => {
    setSearch(e.target.checked);
  };

  const handleChangePickers = (key) => (value) => {
    setExhibition({ ...exhibition, [key]: value });
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setExhibition({ ...exhibition, [name]: value });
  };

  const handleSearchInput = (e) => {
    const { name, value } = e.target;
    setSearchExhibition({ ...searchExhibition, [name]: value });
  };
  const handleSearchStatus = (e) => {
    setSearchExhibition({ ...searchExhibition, status: e.target.checked });
  };

  const handleSearchApprovalStatus = (e) => {
    setSearchExhibition({
      ...searchExhibition,
      approvalStatus: e.target.value,
    });
  };

  const formNavigationString = (post) => {
    let navString = "";

    for (let [key, value] of Object.entries(post)) {
      let firstOrConsequent = navString.includes("?") ? "&&" : "?";

      let customKeys = ["price", "status", "approvalStatus"];

      if (key === "price" && value !== defaultSearchExhibition[`${key}`])
        navString += `${firstOrConsequent}${key}[lte]=${value}`;

      if (key === "status")
        navString += `${firstOrConsequent}${key}[eq]=${value ? 1 : 0}`;

      if (key === "approvalStatus")
        navString += `${firstOrConsequent}${key}[eq]=${value}`;

      if (value !== defaultSearchExhibition[key] && !customKeys.includes(key))
        navString += `${firstOrConsequent}${key}[regex]=${value}`;
    }

    console.log(navString);

    return navString;
  };

  const filter = (post) => {
    const string = formNavigationString(post);
    navigate("/exhibitions" + string);
    return string;
  };

  useEffect(() => {
    console.log(formNavigationString(searchExhibition));
  }, [searchExhibition]);

  return (
    <>
      {isAuth ? (
        <div className="sider-wrapper">
          <div className="sider-search-wrapper">
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" color="white">
                Search
              </Typography>
              <SearchIcon sx={{ color: "white" }} />
              <Switch
                color="default"
                checked={isSearch}
                onChange={handleChangeSearch}
                inputProps={{ "aria-label": "controlled" }}
              />
              <AddBoxIcon sx={{ color: "white" }} />
              <Typography variant="h6" color="white">
                Add
              </Typography>
            </Stack>
          </div>
          {isSearch ? (
            <Box component="form">
              <div className="sider-flex">
                <TextField
                  name="name"
                  value={exhibition.name}
                  onChange={handleChangeInput}
                  variant="filled"
                  label="Name"
                  placeholder="Provide name..."
                  sx={{ background: "white" }}
                ></TextField>
                <TextField
                  name="place"
                  value={exhibition.place}
                  onChange={handleChangeInput}
                  variant="filled"
                  label="Place"
                  placeholder="Provide place..."
                  sx={{ background: "white" }}
                ></TextField>
                <TextField
                  name="price"
                  value={exhibition.price}
                  onChange={handleChangeInput}
                  variant="filled"
                  type="number"
                  label="Price"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₴</InputAdornment>
                    ),
                  }}
                  sx={{ background: "white" }}
                ></TextField>
                <TextField
                  name="image"
                  value={exhibition.image}
                  onChange={handleChangeInput}
                  variant="filled"
                  label="Thumbnail URL"
                  sx={{ background: "white" }}
                ></TextField>
                <TextField
                  name="content"
                  value={exhibition.content}
                  onChange={handleChangeInput}
                  variant="filled"
                  label="Content"
                  multiline
                  rows={4}
                  placeholder="Describe the exhibition..."
                  className="sider-flex-full"
                  sx={{ background: "white" }}
                ></TextField>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    name="date"
                    label="Start Date"
                    value={exhibition.date}
                    onChange={(newValue) => {
                      handleChangePickers("date")(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{ background: "white" }}
                        variant="filled"
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
                <Button
                  variant="contained"
                  onClick={() => {
                    createExhibition(exhibition);
                    dispatch(pokeGlobal());
                  }}
                  className="sider-flex-full"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    ":hover": { backgroundColor: "gold" },
                  }}
                >
                  Add Exhibition
                </Button>
              </div>
            </Box>
          ) : (
            <Box component="form">
              <div className="sider-flex">
                <TextField
                  name="name"
                  value={searchExhibition.name}
                  onInput={handleSearchInput}
                  variant="filled"
                  label="Exhibition name"
                  placeholder="Enter exhibition name..."
                  className="sider-flex-full"
                  sx={{ background: "white" }}
                ></TextField>
                <TextField
                  name="content"
                  value={searchExhibition.content}
                  onInput={handleSearchInput}
                  variant="filled"
                  label="Exhibition content"
                  placeholder="Enter exhibition content..."
                  className="sider-flex-full"
                  sx={{ background: "white" }}
                ></TextField>
                <TextField
                  name="place"
                  value={searchExhibition.place}
                  onInput={handleSearchInput}
                  variant="filled"
                  label="Exhibition place"
                  placeholder="Enter exhibition place..."
                  className="sider-flex-full"
                  sx={{ background: "white" }}
                ></TextField>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    name="price"
                    value={searchExhibition.price}
                    onInput={handleSearchInput}
                    variant="filled"
                    type="number"
                    label="Price under"
                    className="sider-flex-full"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₴</InputAdornment>
                      ),
                    }}
                    sx={{ background: "white" }}
                  ></TextField>
                  <FormLabel sx={{ color: "white" }}>Active</FormLabel>
                  <Checkbox
                    checked={searchExhibition.status}
                    onChange={handleSearchStatus}
                  />
                </Stack>

                <Stack direction="row" className="sider-flex-full">
                  <FormControl>
                    <RadioGroup
                      value={searchExhibition.approvalStatus}
                      onChange={handleSearchApprovalStatus}
                      row
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value={0}
                        control={<Radio />}
                        label="Pending"
                      />
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label="Approved"
                      />
                      <FormControlLabel
                        value={2}
                        control={<Radio />}
                        label="Rejected"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing={1} className="sider-flex-full">
                  <Button
                    variant="contained"
                    onClick={() => {
                      filter(searchExhibition);
                    }}
                    className="sider-flex-full"
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      ":hover": { backgroundColor: "gold" },
                    }}
                  >
                    Search
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSearchExhibition(defaultSearchExhibition);
                      navigate("/exhibitions");
                    }}
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      ":hover": { backgroundColor: "tomato" },
                    }}
                  >
                    <ClearIcon />
                  </Button>
                </Stack>
              </div>
            </Box>
          )}
        </div>
      ) : (
        <div className="sider-wrapper">
          <Box component="form">
            <div className="sider-flex">
              <TextField
                name="name"
                value={searchExhibition.name}
                onInput={handleSearchInput}
                variant="filled"
                label="Exhibition name"
                placeholder="Enter exhibition name..."
                className="sider-flex-full"
                sx={{ background: "white" }}
              ></TextField>
              <TextField
                name="content"
                value={searchExhibition.content}
                onInput={handleSearchInput}
                variant="filled"
                label="Exhibition content"
                placeholder="Enter exhibition content..."
                className="sider-flex-full"
                sx={{ background: "white" }}
              ></TextField>
              <TextField
                name="place"
                value={searchExhibition.place}
                onInput={handleSearchInput}
                variant="filled"
                label="Exhibition place"
                placeholder="Enter exhibition place..."
                className="sider-flex-full"
                sx={{ background: "white" }}
              ></TextField>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  name="price"
                  value={searchExhibition.price}
                  onInput={handleSearchInput}
                  variant="filled"
                  type="number"
                  label="Price under"
                  className="sider-flex-full"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₴</InputAdornment>
                    ),
                  }}
                  sx={{ background: "white" }}
                ></TextField>
                <FormLabel sx={{ color: "white" }}>Active</FormLabel>
                <Checkbox
                  checked={searchExhibition.status}
                  onChange={handleSearchStatus}
                />
              </Stack>

              <Stack direction="row" className="sider-flex-full">
                <FormControl>
                  <RadioGroup
                    value={searchExhibition.approvalStatus}
                    onChange={handleSearchApprovalStatus}
                    row
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value={0}
                      control={<Radio />}
                      label="Pending"
                    />
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label="Approved"
                    />
                    <FormControlLabel
                      value={2}
                      control={<Radio />}
                      label="Rejected"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>

              <Stack direction="row" spacing={1} className="sider-flex-full">
                <Button
                  variant="contained"
                  onClick={() => {
                    filter(searchExhibition);
                  }}
                  className="sider-flex-full"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    ":hover": { backgroundColor: "gold" },
                  }}
                >
                  Search
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSearchExhibition(defaultSearchExhibition);
                    navigate("/exhibitions");
                  }}
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    ":hover": { backgroundColor: "tomato" },
                  }}
                >
                  <ClearIcon />
                </Button>
              </Stack>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};

export { ExhSider };
