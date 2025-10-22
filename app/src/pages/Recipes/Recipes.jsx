import React, { useCallback, useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { Box, IconButton, Tooltip, Typography, Paper, useMediaQuery, useTheme } from "@mui/material";
import { Delete, Edit, Add, OpenInNew } from "@mui/icons-material";
import { Link } from "react-router-dom";
import RecipeModal from "../../components/RecipeModal/RecipeModal";
import { apiDomain } from "../../utils/utils";
import useFetch from "../../hooks/useFetch";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Time from "../../components/Time/Time";
import Loading from "../../components/Loading/Loading";

const Recipes = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentRowIndex, setCurrentRowIndex] = useState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { loading, error, value } = useFetch(`${apiDomain()}/api/recipes`);

  useEffect(() => {
    setTableData(value);
  }, [value]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "recipeId",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 80,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          // Add safety check for value and ensure it's a string
          const displayValue = value && typeof value === 'string' 
            ? `${value.slice(0, 8)}...` 
            : 'N/A';
          
          return (
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 600,
                color: '#ff6f61',
                fontFamily: 'monospace'
              }}
            >
              {displayValue}
            </Typography>
          );
        },
      },
      {
        accessorKey: "recipeTitle",
        header: "Title",
        size: 140,
        Cell: ({ cell }) => (
          <Typography fontWeight="600" color="#2d3748">
            {cell.getValue() || 'N/A'}
          </Typography>
        ),
      },
      {
        accessorKey: "recipeAuthor",
        header: "Author",
        size: 140,
        Cell: ({ cell }) => (
          <Typography color="#718096">
            {cell.getValue() || 'N/A'}
          </Typography>
        ),
      },
      {
        accessorKey: "recipeContent",
        header: "Content",
        size: 1240,
        Cell: ({ cell }) => {
          const content = cell.getValue();
          return (
            <Typography 
              color="#718096"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {content || 'No content'}
            </Typography>
          );
        },
      },
      {
        accessorKey: "recipeCategory",
        header: "Category",
        size: 140,
        Cell: ({ cell }) => {
          const category = cell.getValue();
          return (
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(255, 111, 97, 0.1), rgba(255, 142, 83, 0.1))',
                color: '#ff6f61',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(255, 111, 97, 0.2)',
                display: 'inline-block'
              }}
            >
              {category || 'Uncategorized'}
            </Box>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 80,
        Cell: ({ cell }) => {
          const dateValue = cell.getValue();
          return dateValue ? <Time dateString={dateValue} /> : 'N/A';
        },
      },
    ],
    []
  );

  // ...existing code...

  const handleCreateNewRow = async (values) => {
    values.recipeId = uuidv4();
    values.createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    try {
      const { data } = await axios.post(`${apiDomain()}/api/recipes`, values);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async (values) => {
    if (!Object.keys(validationErrors).length) {
      const currentRow = tableData[currentRowIndex];
      try {
        const { data } = await axios.put(
          `${apiDomain()}/api/recipes/${currentRow.recipeId}`,
          values
        );
        console.log(data);
      } catch (err) {
        console.log(err);
      }
      setTableData((prevTableData) => {
        const newTableData = [...prevTableData];
        newTableData[currentRowIndex] = { ...currentRow, ...values };
        return newTableData;
      });
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    async (row) => {
      if (
        !confirm(
          `Are you sure you want to delete "${row.getValue("recipeTitle")}"?`
        )
      ) {
        return;
      }
      try {
        const { data } = await axios.delete(
          `${apiDomain()}/api/recipes/${row.original.recipeId}`
        );
        console.log(data);
      } catch (err) {
        console.log(err);
      }
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box 
      sx={{ 
        padding: { xs: '1rem', sm: '2rem' },
        background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
        minHeight: '100vh',
        marginTop: '80px'
      }}
    >
      <Paper 
        elevation={0}
        sx={{
          padding: { xs: '1rem', sm: '2rem' },
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Header Section */}
        <Box sx={{ marginBottom: '2rem' }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ff6f61, #ff8e53)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem',
              fontSize: { xs: '2rem', sm: '3rem' }
            }}
          >
            Recipes
          </Typography>
          <Typography 
            variant="h6" 
            color="#718096"
            sx={{ 
              marginBottom: '2rem',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Manage and create delicious recipes for your culinary journey
          </Typography>
        </Box>

        <MaterialReactTable
          displayColumnDefOptions={{
            "mrt-row-actions": {
              size: isMobile ? 80 : 120,
            },
          }}
          columns={columns}
          data={tableData ?? []}
          editingMode="modal"
          enableColumnOrdering={!isMobile}
          enableEditing
          enableDensityToggle={!isMobile}
          enableFullScreenToggle={!isMobile}
          enableColumnFilters={!isMobile}
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              background: 'transparent'
            }
          }}
          muiTableContainerProps={{
            sx: {
              maxHeight: isMobile ? '60vh' : '70vh',
            }
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: 'rgba(255, 111, 97, 0.1)',
              fontWeight: 600,
              color: '#2d3748',
              fontSize: { xs: '0.75rem', sm: '1rem' },
              padding: { xs: '8px', sm: '16px' }
            }
          }}
          muiTableBodyCellProps={{
            sx: {
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
              padding: { xs: '8px', sm: '16px' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }
          }}
          muiTableBodyRowProps={{
            sx: {
              '&:hover': {
                backgroundColor: 'rgba(255, 111, 97, 0.05)',
              }
            }
          }}
          renderRowActions={({ row, table }) => {
            return (
              <Box sx={{ display: "flex", gap: "0.25rem" }}>
                <Tooltip arrow placement="left" title="Edit">
                  <IconButton
                    onClick={() => {
                      setCreateModalOpen(true);
                      setCurrentRowIndex(row.index);
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      },
                      padding: { xs: '4px', sm: '8px' }
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <Edit fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Delete">
                  <IconButton 
                    onClick={() => handleDeleteRow(row)}
                    sx={{
                      background: 'linear-gradient(135deg, #ff6f61, #ff8e53)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e85a50, #e87c45)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(255, 111, 97, 0.3)'
                      },
                      padding: { xs: '4px', sm: '8px' }
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <Delete fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="View">
                  <IconButton
                    component={Link}
                    to={`/recipes/${row.original.recipeId}`}
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #45a049, #3d8b40)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                      },
                      padding: { xs: '4px', sm: '8px' }
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <OpenInNew fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              </Box>
            );
          }}
          renderTopToolbarCustomActions={() => (
            <button
              style={{
                background: 'linear-gradient(135deg, #ff6f61, #ff8e53)',
                color: 'white',
                border: 'none',
                padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: isMobile ? '0.875rem' : '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255, 111, 97, 0.3)',
                minWidth: isMobile ? 'auto' : '140px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 111, 97, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 111, 97, 0.3)';
              }}
              onClick={() => {
                setCreateModalOpen(true);
                setCurrentRowIndex();
              }}
            >
              <Add fontSize={isMobile ? "small" : "medium"} />
              {isMobile ? 'Create' : 'Create Recipe'}
            </button>
          )}
          initialState={{
            density: isMobile ? 'compact' : 'comfortable',
            columnVisibility: isMobile ? { 
              recipeId: false,
              recipeContent: false,
              createdAt: false
            } : {}
          }}
        />
        
        <RecipeModal
          columns={columns}
          open={createModalOpen}
          onClose={() => {
            setCreateModalOpen(false);
          }}
          handleSaveRowEdits={handleSaveRowEdits}
          handleCreateNewRow={handleCreateNewRow}
          tableData={tableData}
          currentRowIndex={currentRowIndex}
        />
      </Paper>
    </Box>
  );
};

export default Recipes;