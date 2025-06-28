import React, { useState } from 'react'
// node.js library that concatenates classes (strings)
// react plugin used to create charts
import { Line } from 'react-chartjs-2'
import stats from '../assets/img/stats.png'
import RiderStat from '../assets/img/RiderStat.png'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import {
  Box,
  Typography,
  Input,
  Button,
  Container,
  Grid,
  useTheme,
  Card,
  CardContent,
  Fade,
  Grow
} from '@mui/material'
import Header from '../components/Headers/Header'
import { useQuery, gql } from '@apollo/client'
import {
  getDashboardTotal,
  getDashboardSales,
  getDashboardOrders,
  getOrdersByDateRange
} from '../apollo'

import useStyles from '../components/Option/styles'
import useGlobalStyles from '../utils/globalStyles'
import { withTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Calendar, Filter } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const GET_DASHBOARD_TOTAL = gql`
  ${getDashboardTotal}
`
const GET_DASHBOARD_SALES = gql`
  ${getDashboardSales}
`
const GET_DASHBOARD_ORDERS = gql`
  ${getDashboardOrders}
`
const GET_ORDERS = gql`
  ${getOrdersByDateRange}
`

const Dashboard = props => {
  const { t } = props
  const theme = useTheme()
  const restaurantId = localStorage.getItem('restaurantId')

  const dataLine = {
    datasets: {
      label: t('SalesAmount'),
      backgroundColor: theme.palette.secondary.darkest,
      borderColor: theme.palette.secondary.darkest
    }
  }
  const dataBar = {
    datasets: {
      label: t('OrderCount'),
      backgroundColor: theme.palette.warning.dark,
      borderColor: theme.palette.warning.dark
    }
  }

  const intializeStartDate = () => {
    var d = new Date()
    d.setDate(d.getDate() - 7)
    return d.toISOString().substr(0, 10)
  }
  const [stateData, setStateData] = useState({
    startingDate: intializeStartDate(),
    endingDate: new Date().toISOString().substr(0, 10)
  })

  const {
    data: dataTotal,
    error: errorTotal,
    loading: loadingTotal
  } = useQuery(GET_DASHBOARD_TOTAL, {
    variables: {
      startingDate: stateData.startingDate.toString(),
      endingDate: stateData.endingDate.toString(),
      restaurant: restaurantId
    }
  })
  const {
    data: dataSales,
    error: errorSales,
    loading: loadingSales
  } = useQuery(GET_DASHBOARD_SALES, {
    variables: {
      startingDate: stateData.startingDate.toString(),
      endingDate: stateData.endingDate.toString(),
      restaurant: restaurantId
    }
  })
  const { data: dataOrders, loading: loadingOrders } = useQuery(
    GET_DASHBOARD_ORDERS,
    {
      variables: {
        startingDate: stateData.startingDate.toString(),
        endingDate: stateData.endingDate.toString(),
        restaurant: restaurantId
      }
    }
  )

  const { data, loading: loadingQuery } = useQuery(GET_ORDERS, {
    variables: {
      startingDate: stateData.startingDate.toString(),
      endingDate: stateData.endingDate.toString(),
      restaurant: restaurantId
    }
  })

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  const StatCard = ({ title, value, icon: Icon, color, isLoading, trend }) => (
    <Grow in timeout={800}>
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: color,
            borderRadius: '20px 20px 0 0'
          }
        }}
      >
        <CardContent sx={{ padding: '0 !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography 
              sx={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <Icon size={24} color={color} />
            </Box>
          </Box>
          
          <Typography
            sx={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#1f2937',
              mb: 1,
              fontFamily: '"Inter", sans-serif'
            }}
          >
            {isLoading ? (
              <Box 
                sx={{ 
                  width: '80px', 
                  height: '32px', 
                  bgcolor: '#f3f4f6', 
                  borderRadius: '8px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} 
              />
            ) : (
              value
            )}
          </Typography>

          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {trend > 0 ? (
                <TrendingUp size={16} color="#10b981" />
              ) : (
                <TrendingDown size={16} color="#ef4444" />
              )}
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: trend > 0 ? '#10b981' : '#ef4444'
                }}
              >
                {Math.abs(trend)}% from last week
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  )

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {errorTotal && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {`Error: ${errorTotal.message}`}
            </Alert>
          </Box>
        )}

        {/* Filter Section with modern design */}
        <Fade in timeout={600}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '32px',
              mb: 4,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Filter size={24} color="#667eea" style={{ marginRight: '12px' }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#374151',
                  fontSize: '20px'
                }}
              >
                {t('GraphFilter')}
              </Typography>
            </Box>

            <Grid container spacing={3} alignItems="end">
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontWeight: 600, color: '#4b5563', mb: 1 }}>
                  {t('StartDate')}
                </Typography>
                <Input
                  type="date"
                  fullWidth
                  max={new Date().toISOString().substr(0, 10)}
                  onChange={event => {
                    setStateData({
                      ...stateData,
                      startingDate: event.target.value
                    })
                  }}
                  value={stateData.startingDate}
                  disableUnderline
                  sx={{
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#f1f5f9'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                      border: '2px solid #667eea'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontWeight: 600, color: '#4b5563', mb: 1 }}>
                  {t('EndDate')}
                </Typography>
                <Input
                  type="date"
                  fullWidth
                  max={new Date().toISOString().substr(0, 10)}
                  onChange={event => {
                    setStateData({
                      ...stateData,
                      endingDate: event.target.value
                    })
                  }}
                  value={stateData.endingDate}
                  disableUnderline
                  sx={{
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#f1f5f9'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                      border: '2px solid #667eea'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Button
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  {t('Apply')}
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Fade>

        <Grid container spacing={4}>
          {/* Chart Section */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={800}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '32px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#374151', 
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <TrendingUp size={28} color="#667eea" />
                  Sales & Orders Analytics
                </Typography>
                
                <Box sx={{ height: 400, position: 'relative' }}>
                  {errorSales ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography color="error">Error loading chart data</Typography>
                    </Box>
                  ) : (
                    <Line
                      height={400}
                      data={{
                        labels: loadingSales
                          ? []
                          : dataSales &&
                            dataSales.getDashboardSales.orders.map(d => d.day),
                        datasets: [
                          {
                            ...dataLine.datasets,
                            data: loadingSales
                              ? []
                              : dataSales &&
                                dataSales.getDashboardSales.orders.map(d => d.amount),
                            lineTension: 0.4,
                            fill: true,
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            borderWidth: 3,
                            pointBackgroundColor: '#667eea',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 3,
                            pointRadius: 6
                          },
                          {
                            ...dataBar.datasets,
                            data: loadingOrders
                              ? []
                              : dataOrders &&
                                dataOrders.getDashboardOrders.orders.map(d => d.count),
                            borderWidth: 3,
                            backgroundColor: 'rgba(251, 146, 60, 0.1)',
                            borderColor: '#fb923c',
                            pointBackgroundColor: '#fb923c',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 3,
                            pointRadius: 6
                          }
                        ]
                      }}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'top',
                            labels: {
                              usePointStyle: true,
                              padding: 20,
                              font: {
                                size: 14,
                                weight: '600'
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)',
                              drawBorder: false
                            },
                            ticks: {
                              color: '#6b7280',
                              font: {
                                size: 12,
                                weight: '500'
                              }
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            },
                            ticks: {
                              color: '#6b7280',
                              font: {
                                size: 12,
                                weight: '500'
                              }
                            }
                          }
                        }
                      }}
                    />
                  )}
                </Box>
              </Card>
            </Fade>
          </Grid>

          {/* Stats Cards Section */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={12}>
                <StatCard
                  title={t('TotalOrders')}
                  value={loadingTotal ? '...' : dataTotal && dataTotal.getDashboardTotal.totalOrders}
                  icon={ShoppingCart}
                  color="#667eea"
                  isLoading={loadingTotal}
                  trend={12.5}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} lg={12}>
                <StatCard
                  title="COD Orders"
                  value={loadingQuery ? '...' : data && data.getOrdersByDateRange.countCashOnDeliveryOrders}
                  icon={Calendar}
                  color="#10b981"
                  isLoading={loadingQuery}
                  trend={8.2}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} lg={12}>
                <StatCard
                  title={t('TotalSales')}
                  value={loadingTotal ? '...' : dataTotal && dataTotal.getDashboardTotal.totalSales}
                  icon={DollarSign}
                  color="#f59e0b"
                  isLoading={loadingTotal}
                  trend={15.8}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} lg={12}>
                <StatCard
                  title="COD Sales"
                  value={loadingQuery ? '...' : data && data.getOrdersByDateRange.totalAmountCashOnDelivery}
                  icon={TrendingUp}
                  color="#ef4444"
                  isLoading={loadingQuery}
                  trend={-2.4}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Enhanced Custom Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </Box>
  )
}

export default withTranslation()(Dashboard)
