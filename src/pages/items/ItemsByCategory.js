import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  IconButton,
  Link,
  Toolbar,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Import Add icon
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // Get URL parameters
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon
import CryptoJS from "crypto-js"; // Import CryptoJS
import { useAuth } from "../../context/authContext";
import SearchIcon from "@mui/icons-material/Search";

const ItemsByCategory = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    serialNumber: "",
    labCode: "",
    name: "",
    status: "",
    comment: "",
    itemTypeId: "",
    userId: "",
  });
  const [itemTypes, setItemTypes] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Track the status filter
  // const { itemTypeId } = useParams(); // Extract itemTypeId from URL
  const { itemTypeId: encryptedItemTypeId } = useParams(); // Extract encrypted itemTypeId from URL
  const [itemTypeTitle, setItemTypeTitle] = useState(""); // Track item type title
  const [user1, setUser] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [filter, setFilter] = useState({ itemTypeId: "", userId: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isAddNewRecord, setIsAddNewRecord] = useState(false); // Toggle for Add Item Form
  const [selectedItemId, setSelectedItemId] = useState(null); // Store selected item by ID
  const [isEditMode, setIsEditMode] = useState(false); // For toggling edit form visibility
  const [isDeactivateMode, setIsDeactivateMode] = useState(false); // For toggling deactivate form visibility
  const [deactivateComment, setDeactivateComment] = useState(""); // For deactivate comment
  const [searchQuery, setSearchQuery] = useState("");

  // const [selectedItemId, setSelectedItemId] = useState(null); // State to track selected record
  // State variables to manage form visibility
  const [editFormsVisibility, setEditFormsVisibility] = useState({});
  const [deactivateFormsVisibility, setDeactivateFormsVisibility] = useState(
    {}
  );
  const {user} = useAuth();
  // page protection to users
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to NotFound route if user position is not "IT" or "Director"
    if (user?.position !== 'IT') {
      navigate('/restricted_page');
    }
  }, [user, navigate]);
  // end page protection to users

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setUserEmail(email);
      fetchUser(email); 
    }
  }, []);

  useEffect(() => {
    fetchItems();
    fetchItemTypes();
  }, [filter, encryptedItemTypeId]);
  
  // Decrypt function to handle encrypted itemTypeId
  const decryptId = (encryptedId) => {
    const secretKey = "hdhdhdhhddhhdhddgdfgdfdgddffdfd867766884944gdgff!443$%%%$$fgfgfgfgfg"; // Use the same key you used for encryption
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const decryptedItemTypeId = decryptId(encryptedItemTypeId); // Decrypt the ID
      let url = `${process.env.REACT_APP_API_BASE_URL}/items/type/${decryptedItemTypeId}`; //DISPLAY LIST OF CLICKED ITEM TYPES ID FROM DASHBOARD
      if (filter.itemTypeId) {
        url = `${process.env.REACT_APP_API_BASE_URL}/items/type/${filter.itemTypeId}`;
      } else if (filter.userId) {
        url = `${process.env.REACT_APP_API_BASE_URL}/items/user/${filter.userId}`;
      }

      // Fetch items and item type title in parallel
      const [itemsResponse, itemTypeResponse] = await Promise.all([
        axios.get(url, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/item_types/byId/${decryptedItemTypeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Set the fetched item type title
      setItemTypeTitle(itemTypeResponse.data.title);

      // Set the fetched items
      setItems(itemsResponse.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchItemTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/item_types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItemTypes(response.data);
    } catch (error) {
      console.error("Error fetching item types:", error);
    }
  };

  const fetchUser = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      const userRecord = response.data.find((u) => u.email === email);
      if (userRecord) {
        setNewItem((prev) => ({ ...prev, userId: userRecord.userId }));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };
  const handleEditChange = (e, item) => {
    const { name, value } = e.target;
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.itemId === item.itemId ? { ...i, [name]: value } : i
      )
    );
  };

  const handleSubmitEdit = async (e, item) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/items/${item.itemId}`,
        {
          serialNumber: item.serialNumber,
          labCode: item.labCode,
          name: item.name,
          status: item.status,
          comment: item.comment,
          itemTypeId: item.itemTypeId, // Use itemTypeId instead of title
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Assuming backend sends { message: 'Item successfully updated.', item }
      setSnackbarMessage(response.data.message || "Item updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchItems(); // Refresh the list after update
      setSelectedItemId(null); // Clear selection
      setIsEditMode(false);
    } catch (error) {
      // Set error message from backend or fallback to default
      const errorMessage =
        error.response?.data?.error || "Failed to update item.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeactivateSubmit = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/items/${item.itemId}`,
        {
          status: "Destroyed",
          comment: deactivateComment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbarMessage(
        response.data.message || "Item successfully deactivated."
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchItems(); // Refresh the list after deactivation
      setSelectedItemId(null); // Clear selection
      setIsDeactivateMode(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to deactivate item.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/items`, newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage("Item successfully added.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchItems(); // Refresh the list
      setNewItem({
        serialNumber: "",
        labCode: "",
        name: "",
        status: "",
        comment: "",
        itemTypeId: "",
        userId: "",
      }); // Reset form
      setIsAddNewRecord(false); // Close the form
    } catch (error) {
      setSnackbarMessage("Failed to add item.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // ITEM STATUS (WORKING AND DESTROYED BUTTONS)
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status); // Set the selected status filter
  };

  // const filteredItems = statusFilter
  //   ? items.filter((item) => item.status === statusFilter)
  //   : items;
  // END ITEM STATUS (WORKING AND DESTROYED BUTTONS)

  // LIVE SEARCH
  const filteredItems = statusFilter
    ? items.filter(
        (item) =>
          item.status === statusFilter &&
          (item.serialNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            item.labCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : items.filter(
        (item) =>
          item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.labCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  // LIVE SEARCH


    // PAGINATION
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5); // Set default rows per page
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); // Reset to first page when rows per page changes
    };
    const paginatedItems = filteredItems.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  
    // END OF PAGINATION

  return (
    <Container>
    <Toolbar sx={{mt: 2,}} />
      <Box mb={0}>
        <Button
          title={isAddNewRecord ? "Close Form" : "Add New Record"}
          variant="contained"
          startIcon={isAddNewRecord ? <CloseIcon /> : <AddIcon />} // Conditionally render icon
          onClick={() => setIsAddNewRecord(!isAddNewRecord)}
          className="mr-2"
          sx={{
            backgroundColor: isAddNewRecord ? "error.main" : "primary.main", // Danger for close, primary for add
            color: "white", // White text and icon color
            "&:hover": {
              backgroundColor: isAddNewRecord ? "error.dark" : "primary.dark", // Darker shades on hover
            },
            
          }}
        >
          {isAddNewRecord ? "Cancel Form" : "Add New Item"}
        </Button>
        <Button
          variant="contained"
          className="mr-2 text-white  d-none d-sm-inline-block"
          onClick={() => handleStatusFilterChange("Working")}
        >
          Working
        </Button>
        <Button
          variant="contained"
          className="mr-2 text-white   d-none d-sm-inline-block"
          onClick={() => handleStatusFilterChange("Destroyed")}
        >
          Destroyed
        </Button>
   
      </Box>

      {isAddNewRecord && (
        <Box mt={3}>
          <Typography variant="h6">Add New Item</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  name="serialNumber"
                  value={newItem.serialNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lab Code"
                  name="labCode"
                  value={newItem.labCode}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={newItem.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="itemTypeId-label">Item Type</InputLabel>
                  <Select
                    labelId="itemTypeId-label"
                    name="itemTypeId"
                    value={newItem.itemTypeId}
                    onChange={handleChange}
                    required
                  >
                    {itemTypes.map((type) => (
                      <MenuItem key={type.itemTypeId} value={type.itemTypeId}>
                        {type.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Status and conditional comment section */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={newItem.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="Working">Working</MenuItem>
                    <MenuItem value="Destroyed">Destroyed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Conditionally show comment field if status is 'Destroyed' */}
              {newItem.status === "Destroyed" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Reason for Destroyed"
                    name="comment"
                    value={newItem.comment}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      )}
      {/* 
      <Typography variant="h5" gutterBottom>List of Items for Item Type: {itemTypeTitle}</Typography> */}
      {itemTypeTitle ? (
        <>

             
<div style={{display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",}}>
                  <Typography variant="h5" gutterBottom>
          List of Items for Item Category:{" "}
          <span className="text-success">{itemTypeTitle}</span>
        </Typography>
                  <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{ mt: 2 }}
          style={{ marginLeft: "auto", minWidth: "400px", maxWidth: "400px" }}
          // className="d-none d-sm-inline-block"
        >
        <TextField
          label="Search by Item Serial Number or University code or Item Name"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // placeholder="Search by Item Serial Number or University code or Item Name"
          variant="outlined"
          fullWidth
          InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              padding: { xs: 1, sm: 0 }, // Adjust padding for small screens
            }}
        />
        </Grid>
        
        </div>
        </>
      ) : (
        <Typography variant="h5" gutterBottom>
          Loading Item Type...
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Lab Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Item Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Uploaded By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, index) => (
                <React.Fragment key={item.itemId}>
                  <TableRow
                    onClick={() => {
                      setSelectedItemId(
                        selectedItemId === item.itemId ? null : item.itemId
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.serialNumber}</TableCell>
                    <TableCell>{item.labCode}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      {
                        itemTypes.find(
                          (type) => type.itemTypeId === item.itemTypeId
                        )?.title
                      }
                    </TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.user?.fname} {item.user?.lname} </TableCell>
                  </TableRow>

                  {/* Display Edit/Deactivate Buttons under the clicked record */}
                  {selectedItemId === item.itemId && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Box mt={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setEditFormsVisibility((prev) => ({
                                ...prev,
                                [item.itemId]: !prev[item.itemId], // Toggle visibility for the specific item
                              }));
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            style={{ marginLeft: "20px" }}
                            onClick={() => {
                              setDeactivateFormsVisibility((prev) => ({
                                ...prev,
                                [item.itemId]: !prev[item.itemId], // Toggle visibility for the specific item
                              }));
                            }}
                          >
                            Deactivate
                          </Button>
                        </Box>

                        {/* Edit Form */}
                        {editFormsVisibility[item.itemId] && (
                          <Box mt={3}>
                            <Typography variant="h6">Edit Item</Typography>
                            <form onSubmit={(e) => handleSubmitEdit(e, item)}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Serial Number"
                                    name="serialNumber"
                                    value={item.serialNumber}
                                    onChange={(e) => handleEditChange(e, item)}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Lab Code"
                                    name="labCode"
                                    value={item.labCode}
                                    onChange={(e) => handleEditChange(e, item)}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <FormControl fullWidth>
                                    <InputLabel id="itemTypeId-label">
                                      Item Type
                                    </InputLabel>
                                    <Select
                                      labelId="itemTypeId-label"
                                      name="itemTypeId"
                                      value={item.itemTypeId}
                                      onChange={(e) =>
                                        handleEditChange(e, item)
                                      }
                                    >
                                      {itemTypes.map((itemType) => (
                                        <MenuItem
                                          key={itemType.itemTypeId}
                                          value={itemType.itemTypeId}
                                        >
                                          {itemType.title}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Item Name"
                                    name="name"
                                    value={item.name}
                                    onChange={(e) => handleEditChange(e, item)}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <FormControl fullWidth margin="normal">
                                    <InputLabel id="status-label">
                                      Status
                                    </InputLabel>
                                    <Select
                                      labelId="status-label"
                                      name="status"
                                      value={item.status}
                                      onChange={(e) =>
                                        handleEditChange(e, item)
                                      }
                                    >
                                      <MenuItem value="Working">
                                        Working
                                      </MenuItem>
                                      <MenuItem value="Destroyed">
                                        Destroyed
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>

                                {/* Show comment field only when 'Destroyed' is selected */}
                                {item.status === "Destroyed" && (
                                  <Grid item xs={12} sm={12}>
                                    <TextField
                                      fullWidth
                                      label="Comment"
                                      name="comment"
                                      value={item.comment || ""}
                                      onChange={(e) =>
                                        handleEditChange(e, item)
                                      }
                                      multiline
                                      rows={4}
                                      placeholder="Add a comment for why the item is destroyed"
                                    />
                                  </Grid>
                                )}

                                <Grid item xs={12}>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                  >
                                    Update Item
                                  </Button>
                                </Grid>
                              </Grid>
                            </form>
                          </Box>
                        )}
                        {/* // Deactivate Form */}
                        {deactivateFormsVisibility[item.itemId] && (
                          <Box mt={3}>
                            <Typography variant="h6">
                              Deactivate Item
                            </Typography>
                            <TextField
                              label="Deactivation Comment"
                              fullWidth
                              value={deactivateComment || item.comment || ""} // Show existing comment or allow new input
                              onChange={(e) =>
                                setDeactivateComment(e.target.value)
                              }
                              multiline
                              rows={4}
                            />
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleDeactivateSubmit(item)}
                              fullWidth
                            >
                              Deactivate
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" className="text-danger">
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
                {/* Pagination Component */}
                <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // Customize as needed
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Snackbar
        style={{ marginTop: "70px", marginRight: "78px" }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ItemsByCategory;