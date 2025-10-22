import React, { useCallback, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Chip,
  useTheme,
  useMediaQuery,
  Fab
} from "@mui/material";
import { Delete, Edit, Add, Category as CategoryIcon } from "@mui/icons-material";
import CategoryModal from "../../components/CategoryModal/CategoryModal";
import axios from "axios";
import { apiDomain } from "../../utils/utils";
import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Loading from "../../components/Loading/Loading";
import Time from "../../components/Time/Time";

const Categories = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentRowIndex, setCurrentRowIndex] = useState();
  const { loading, error, value } = useFetch(`${apiDomain()}/api/categories`);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setTableData(value);
  }, [value]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "categoryName",
        header: "Category Name",
        size: isMobile ? 120 : 200,
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CategoryIcon sx={{ color: '#ff6f61', fontSize: '1.2rem' }} />
            <Typography 
              fontWeight="600" 
              color="#2d3748"
              sx={{ 
                fontSize: { xs: '0.875rem', md: '1rem' },
                wordBreak: 'break-word'
              }}
            >
              {cell.getValue()}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "categoryDescription",
        header: "Description",
        size: isMobile ? 150 : 300,
        Cell: ({ cell }) => (
          <Typography 
            color="#718096"
            sx={{ 
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: isMobile ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {cell.getValue() || 'No description'}
          </Typography>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        size: isMobile ? 100 : 140,
        Cell: ({ cell }) => (
          <Chip
            label={<Time dateString={cell.getValue("createdAt")} />}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 111, 97, 0.1)',
              color: '#ff6f61',
              fontWeight: 500,
              fontSize: { xs: '0.7rem', md: '0.75rem' }
            }}
          />
        ),
      },
    ],
    [isMobile]
  );

  // Mobile Card Component for better mobile experience
  const MobileCard = ({ item, index }) => (
    <Card 
      sx={{
        marginBottom: 2,
        borderRadius: '16px',
        border: '1px solid rgba(255, 111, 97, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          borderColor: 'rgba(255, 111, 97, 0.3)'
        }
      }}
    >
      <CardContent sx={{ padding: '1.5rem' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <CategoryIcon sx={{ color: '#ff6f61', fontSize: '1.5rem' }} />
            <Typography 
              variant="h6" 
              fontWeight="700"
              color="#2d3748"
              sx={{ fontSize: '1.1rem' }}
            >
              {item.categoryName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => {
                setCreateModalOpen(true);
                setCurrentRowIndex(index);
              }}
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleDeleteRow({ original: item, index })}
              sx={{
                background: 'linear-gradient(135deg, #ff6f61, #ff8e53)',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': {
                  background: 'linear-gradient(135deg, #e85a50, #e87c45)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Typography 
          color="#718096" 
          sx={{ 
            mb: 2, 
            lineHeight: 1.5,
            fontSize: '0.875rem'
          }}
        >
          {item.categoryDescription || 'No description available'}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={<Time dateString={item.createdAt} />}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 111, 97, 0.1)',
              color: '#ff6f61',
              fontWeight: 500
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  const handleCreateNewRow = async (values) => {
    values.createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    try {
      const { data } = await axios.post(
        `${apiDomain()}/api/categories`,
        values
      );
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
      tableData[currentRowIndex] = {...currentRow, ...values}
      try {
        const { data } = await axios.put(
          `${apiDomain()}/api/categories/${currentRow.categoryName}`,
          values
        );
        console.log(data);
      } catch (err) {
        console.log(err);
      }
      setTableData([...tableData]);
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    async (row) => {
      if (
        !confirm(
          `Are you sure you want to delete ${row.original.categoryName}?`
        )
      ) {
        return;
      }
      try {
        const { data } = await axios.delete(
          `${apiDomain()}/api/categories/${row.original.categoryName}`
        );
        if (data.sqlMessage) {
          alert(
            data.sqlMessage +
              "\n\nHINT: You cannot delete a category that has relation to a recipe that exists!"
          );
        } else {
          console.log(data);
          tableData.splice(row.index, 1);
          setTableData([...tableData]);
        }
      } catch (err) {
        alert(err);
      }
    },
    [tableData]
  );

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box 
      mt={{ xs: 2, md: 8 }}
      sx={{ 
        padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
        background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <Paper 
        elevation={0}
        sx={{
          padding: { xs: '1.5rem', md: '2rem' },
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header Section */}
        <Box sx={{ marginBottom: { xs: '1.5rem', md: '2rem' } }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"}
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ff6f61, #ff8e53)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            Categories
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h6"}
            color="#718096"
            sx={{ 
              marginBottom: { xs: '1.5rem', md: '2rem' },
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '0.875rem', md: '1.25rem' }
            }}
          >
            Manage your recipe categories and organize your culinary creations
          </Typography>
        </Box>

        {/* Mobile View */}
        {isMobile ? (
          <Box>
            {tableData?.map((item, index) => (
              <MobileCard key={index} item={item} index={index} />
            ))}
          </Box>
        ) : (
          /* Desktop Table View */
          <MaterialReactTable
            displayColumnDefOptions={{
              "mrt-row-actions": {
                size: 120,
              },
            }}
            columns={columns}
            data={tableData ?? []}
            editingMode="modal"
            enableColumnOrdering
            enableEditing
            onEditingRowSave={handleSaveRowEdits}
            onEditingRowCancel={handleCancelRowEdits}
            muiTablePaperProps={{
              elevation: 0,
              sx: {
                borderRadius: '16px',
                border: '1px solid rgba(255, 111, 97, 0.1)',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: 'rgba(255, 111, 97, 0.08)',
                fontWeight: 700,
                color: '#2d3748',
                fontSize: '1rem',
                borderBottom: '2px solid rgba(255, 111, 97, 0.2)'
              }
            }}
            muiTableBodyCellProps={{
              sx: {
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                padding: '1rem'
              }
            }}
            muiTableBodyRowProps={{
              sx: {
                '&:hover': {
                  backgroundColor: 'rgba(255, 111, 97, 0.04)',
                  transform: 'scale(1.005)',
                  transition: 'all 0.2s ease'
                }
              }
            }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <Tooltip arrow placement="left" title="Edit Category">
                  <IconButton
                    onClick={() => {
                      setCreateModalOpen(true);
                      setCurrentRowIndex(row.index);
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="Delete Category">
                  <IconButton 
                    onClick={() => handleDeleteRow(row)}
                    sx={{
                      background: 'linear-gradient(135deg, #ff6f61, #ff8e53)',
                      color: 'white',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e85a50, #e87c45)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(255, 111, 97, 0.3)'
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            renderTopToolbarCustomActions={() => (
              <button
                style={{
                  background: 'linear-gradient(135deg, #ff6f61, #ff8e53)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(255, 111, 97, 0.3)'
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
                <Add />
                Create Category
              </button>
            )}
          />
        )}
        
        <CategoryModal
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

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add category"
          onClick={() => {
            setCreateModalOpen(true);
            setCurrentRowIndex();
          }}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #ff6f61, #ff8e53)',
            color: 'white',
            width: 64,
            height: 64,
            boxShadow: '0 8px 25px rgba(255, 111, 97, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #e85a50, #e87c45)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 35px rgba(255, 111, 97, 0.5)'
            }
          }}
        >
          <Add fontSize="large" />
        </Fab>
      )}
    </Box>
  );
};

export default Categories;