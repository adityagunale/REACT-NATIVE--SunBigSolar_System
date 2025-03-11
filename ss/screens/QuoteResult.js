import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { LineChart, BarChart } from 'react-native-chart-kit';

const InfoTooltip = ({ visible, onClose, title, message }) => {
  if (!visible) return null;
  
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableOpacity 
        style={styles.tooltipOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltipContent}>
            <Text style={styles.tooltipTitle}>{title}</Text>
            <Text style={styles.tooltipMessage}>{message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const QuoteResult = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { quoteData } = route.params;
  const [activeTooltip, setActiveTooltip] = useState(null);

  const tooltipData = {
    panels: {
      title: "Approximate number of panels",
      message: "You will have to install, assuming 545 Wp capacity of panels"
    },
    inverters: {
      title: "Number of Inverters",
      message: "Based on your system size, this is the recommended number of inverters needed"
    },
    firstYear: {
      title: "First Year Generation",
      message: "Estimated energy generation in the first year based on your location and system size"
    },
    twentyFiveYears: {
      title: "25 Years Generation",
      message: "Projected total energy generation over 25 years, accounting for panel degradation"
    },
    systemCost: {
      title: "System Cost",
      message: "Total cost including panels, inverters, mounting structure, and installation"
    },
    omCost: {
      title: "Yearly O&M Cost",
      message: "Annual maintenance cost to ensure optimal system performance"
    },
    savings: {
      title: "25 Years Savings",
      message: "Projected financial savings over the system lifetime"
    },
    payback: {
      title: "Payback Time",
      message: "Estimated time to recover your initial investment through energy savings"
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-IN').format(number);
  };

  // Calculate environmental impact values
  const calculateEnvironmentalImpact = () => {
    const systemSize = quoteData.systemSize;
    const annualGeneration = systemSize * 1500; // kWh per year
    const lifetimeYears = 25;
    const totalGeneration = annualGeneration * lifetimeYears;

    // CO2 Saved (in tonnes)
    // Assuming 0.7 kg CO2 per kWh from conventional power
    const co2Saved = (totalGeneration * 0.7) / 1000;

    // Fuel Saved (in litres)
    // Assuming 0.3 litres of diesel per kWh
    const fuelSaved = totalGeneration * 0.3;

    // Trees Planted
    // Assuming one tree absorbs 200 kg CO2 per year
    const treesEquivalent = Math.round(co2Saved / (200 * lifetimeYears));

    // Cars Removed
    // Assuming one car emits 2 tonnes CO2 per year
    const carsEquivalent = Math.round(co2Saved / (2 * lifetimeYears));

    return {
      co2Saved: Math.round(co2Saved),
      fuelSaved: Math.round(fuelSaved),
      treesEquivalent,
      carsEquivalent
    };
  };

  const environmentalImpact = calculateEnvironmentalImpact();

  // Monthly generation data with dynamic values
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      data: [
        Math.round(quoteData.systemSize * 120), // Winter months
        Math.round(quoteData.systemSize * 130),
        Math.round(quoteData.systemSize * 150),
        Math.round(quoteData.systemSize * 180),
        Math.round(quoteData.systemSize * 200),
        Math.round(quoteData.systemSize * 180),
        Math.round(quoteData.systemSize * 150),
        Math.round(quoteData.systemSize * 140),
        Math.round(quoteData.systemSize * 160),
        Math.round(quoteData.systemSize * 170),
        Math.round(quoteData.systemSize * 140),
        Math.round(quoteData.systemSize * 130)
      ],
    }]
  };

  // Calculate monthly average and total
  const monthlyAverage = Math.round(monthlyData.datasets[0].data.reduce((a, b) => a + b, 0) / 12);
  const totalGeneration = monthlyData.datasets[0].data.reduce((a, b) => a + b, 0);

  // 25 Year savings data with dynamic values
  const yearlyData = {
    labels: ['2', '4', '6', '8', '10', '13', '16', '19', '22', '25'],
    datasets: [{
      data: Array.from({ length: 10 }, (_, i) => {
        const year = [2, 4, 6, 8, 10, 13, 16, 19, 22, 25][i];
        return Math.round(quoteData.annualSavings * year);
      }),
    }]
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#0D1A69', '#01C1EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.iconback}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="white" style={styles.title} />
          </TouchableOpacity>
          <Text style={styles.title1}>Solculator</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.white}>
          <View style={styles.gridContainer}>
            {/* Technical Details Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="cog" size={26} color="#0a1172" />
                <Text style={styles.cardTitle}>Technical Details</Text>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Number of <Text style={{fontWeight:500, color:'#0a1172'}}>Panels</Text></Text>
                  <View style={{flexDirection:'row', alignItems:'center', gap:5, marginLeft:10, marginTop:5}}>
                    <Icon name="chevron-right" size={16} color="white" backgroundColor="#0a1172" padding={5} borderRadius={12} width={30} style={{textAlign: 'center'}} />
                    <Text style={styles.detailValue}>{quoteData.numberOfPanels}</Text>
                    <TouchableOpacity onPress={() => setActiveTooltip('panels')} style={{marginLeft: 'auto'}}>
                      <Icon name="info-circle" size={26} color="#425578" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Number of <Text style={{fontWeight:500, color:'#0a1172'}}>Inverters</Text> </Text>
                  <View style={{flexDirection:'row', alignItems:'center', gap:5, marginLeft:10, marginTop:5}}>
                    <Icon name="chevron-right" size={16} color="white" backgroundColor="#0a1172" padding={5} borderRadius={12} width={30} style={{textAlign: 'center'}} />
                    <Text style={styles.detailValue}>1</Text>
                    <TouchableOpacity onPress={() => setActiveTooltip('inverters')} style={{marginLeft: 'auto'}}>
                      <Icon name="info-circle" size={26} color="#425578" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>1st Year <Text style={{fontWeight:500, color:'#0a1172'}}>Generation</Text></Text>
                  <View style={{flexDirection:'row', alignItems:'center', gap:5, marginLeft:10, marginTop:5}}>
                    <Icon name="chevron-right" size={16} color="white" backgroundColor="#0a1172" padding={5} borderRadius={12} width={30} style={{textAlign: 'center'}} />
                    <Text style={styles.detailValue}>{Math.round(quoteData.systemSize * 1500)} kWh</Text>
                    <TouchableOpacity onPress={() => setActiveTooltip('firstYear')} style={{marginLeft: 'auto'}}>
                      <Icon name="info-circle" size={26} color="#425578" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>25 Years <Text style={{fontWeight:500, color:'#0a1172'}}>Generation</Text></Text>
                  <View style={{flexDirection:'row', alignItems:'center', gap:5, marginLeft:10, marginTop:5}}>
                    <Icon name="chevron-right" size={16} color="white" backgroundColor="#0a1172" padding={5} borderRadius={12} width={30} style={{textAlign: 'center'}} />
                    <Text style={styles.detailValue}>{Math.round(quoteData.systemSize * 1500 * 25)} kWh</Text>
                    <TouchableOpacity onPress={() => setActiveTooltip('twentyFiveYears')} style={{marginLeft: 'auto'}}>
                      <Icon name="info-circle" size={26} color="#425578" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* System Size Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="sun-o" size={26} color="#0a1172" />
                <Text style={styles.cardTitle}>System Size</Text>
              </View>
              <View style={[styles.cardContent, styles.centerContent]}>
                <View style={{backgroundColor: '#e8e8e8', padding: 15, borderRadius: 19, marginBottom: -5, justifyContent:'space-between', width:'70%'}}>
                  <Text style={styles.systemSizeValue}>{quoteData.systemSize}        kWp</Text>
                </View>
                {/* <Text style={styles.systemSizeUnit}>kWp</Text> */}
                <View style={styles.circleContainer}>
                  <AnimatedCircularProgress
                    size={220}
                    width={38}
                    fill={85.95}
                    tintColor="#FFA500"
                    backgroundColor="#0a1172"

                  >
                    {(fill) => (
                      <Text style={styles.circleText}>
                        Solar{'\n'}{fill}%
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                </View>
                <Text style={styles.systemSizeLabel}>Share of solar power utilization</Text>
              </View>
            </View>

            {/* Financial Details Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="money" size={26} color="#0a1172" />
                <Text style={styles.cardTitle}>Financial Details</Text>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>System <Text style={{fontWeight:500, color:'#0a1172'}}>Cost</Text></Text>
                  <View style={{flexDirection:'row', alignItems:'center', gap:5, marginLeft:10}}>
                    <Icon name="chevron-right" size={16} color="white" backgroundColor="#0a1172" padding={5} borderRadius={12} width={30} style={{textAlign: 'center'}} />
                    <Text style={styles.detailValue}>{formatCurrency(quoteData.estimatedCost)}</Text>
                    <TouchableOpacity onPress={() => setActiveTooltip('systemCost')} style={{marginLeft: 'auto'}}>
                      <Icon name="info-circle" size={26} color="#425578" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Yearly O&M <Text style={{fontWeight:500, color:'#0a1172'}}>Cost</Text></Text>
                  <View style={{flexDirection:'row', alignItems:'center', gap:5, marginLeft:10}}>
                    <Icon name="chevron-right" size={16} color="white" backgroundColor="#0a1172" padding={5} borderRadius={12} width={30} style={{textAlign: 'center'}} />
                    <Text style={styles.detailValue}>{formatCurrency(quoteData.estimatedCost * 0.01)}</Text>
                    <TouchableOpacity onPress={() => setActiveTooltip('omCost')} style={{marginLeft: 'auto'}}>
                      <Icon name="info-circle" size={26} color="#425578" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>25 Years <Text style={{fontWeight:500, color:'#0a1172'}}>Savings</Text></Text>
                  <View style={{flexDirection:'row', alignItems:'center', gap:5, marginLeft:10}}>
                    <Icon name="chevron-right" size={16} color="white" backgroundColor="#0a1172" padding={5} borderRadius={12} width={30} style={{textAlign: 'center'}} />
                    <Text style={styles.detailValue}>{formatCurrency(quoteData.annualSavings * 25)}</Text>
                    <TouchableOpacity onPress={() => setActiveTooltip('savings')} style={{marginLeft: 'auto'}}>
                      <Icon name="info-circle" size={26} color="#425578" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payback <Text style={{fontWeight:500, color:'#0a1172'}}>Time</Text></Text>
                  <View style={{flexDirection:'row', alignItems:'center', gap:5, marginLeft:10}}>
                    <Icon name="chevron-right" size={16} color="white" backgroundColor="#0a1172" padding={5} borderRadius={12} width={30} style={{textAlign: 'center'}} />
                    <Text style={styles.detailValue}>{quoteData.paybackPeriod} years</Text>
                    <TouchableOpacity onPress={() => setActiveTooltip('payback')} style={{marginLeft: 'auto'}}>
                      <Icon name="info-circle" size={26} color="#425578" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* 1st Year Savings Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="line-chart" size={26} color="#0a1172" />
                <Text style={styles.cardTitle}>1st Year Savings</Text>
              </View>
              <View style={[styles.cardContent, styles.centerContent]}>
                <Text style={styles.savingsValue}>{formatCurrency(quoteData.annualSavings)}</Text>
                <Text style={styles.savingsLabel}>INR</Text>
                <View style={styles.barChart}>
                  <View style={styles.barContainer}>
                    <View style={styles.bar}>
                      <View style={[styles.barFill, styles.beforeBar]} />
                      <Text style={styles.barLabel}>Before Solar</Text>
                    </View>
                    <View style={styles.bar}>
                      <View style={[styles.barFill, styles.afterBar]} />
                      <Text style={styles.barLabel}>After Solar</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* 1st Year Generation Graph Card */}
            <View style={[styles.card, styles.fullWidthCard]}>
              <View style={styles.cardHeader}>
                <Icon name="line-chart" size={26} color="#0a1172" />
                <Text style={styles.cardTitle}>1st Year Generation Graph</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.graphLabel}>Monthly average: {monthlyAverage} kWh</Text>
                <Text style={styles.graphLabel}>Total: {totalGeneration} kWh produced</Text>
                <LineChart
                  data={monthlyData}
                  width={Dimensions.get('window').width - 60}
                  height={230}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: '#ffa500',
                    },
                    propsForLabels: {
                      fontSize: 12
                    },
                    yAxisSuffix: ' kWh',
                    yAxisInterval: 1,
                    formatYLabel: (value) => Math.round(value).toString(),
                    formatXLabel: (value) => value.toString(),
                    xAxisLabel: 'Months',
                    yAxisLabel: 'Generation',
                    verticalLabelRotation: 30,
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    marginTop:40,
                    borderRadius: 16,
                    paddingRight: 35,
                    paddingBottom: 0
                  }}
                />
              </View>
            </View>

            {/* 25 Year Savings Graph Card */}
            <View style={[styles.card, styles.fullWidthCard]}>
              <View style={styles.cardHeader}>
                <Icon name="bar-chart" size={26} color="#0a1172" />
                <Text style={styles.cardTitle}>25 Year Savings Graph</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.graphLabel}>Total: {formatCurrency(3338283)} savings</Text>
                <BarChart
                  data={yearlyData}
                  width={Dimensions.get('window').width - 60}
                  height={300}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(10, 17, 114, ${opacity})`,
                    fillShadowGradient: 'rgba(10, 17, 114, 1)',
                    fillShadowGradientOpacity: 1,
                    fillShadowGradientFrom: 'rgba(10, 17, 114, 1)', // Set the bottom color
                    fillShadowGradientTo: 'rgba(149, 144, 218, 1)',   // Set the top color to be the same
                    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    barPercentage: 0.6,
                    propsForLabels: {
                      fontSize: 12
                    }
                  }}
                  style={{
                    marginVertical: 8,
                    marginTop:50,
                    borderRadius: 16,
                    paddingRight: 52,
                   marginBottom:-15
                  }}
                />
              </View>
            </View>
          </View>

          {/* Environmental Impact Cards */}
          <View style={styles.impactContainer}>
            <View style={[styles.impactCard, { backgroundColor: '#6B5B95' }]}>
              <Icon name="cloud" size={30} color="white" />
              <Text style={styles.impactValue}>{formatNumber(environmentalImpact.co2Saved)}</Text>
              <Text style={styles.impactUnit}>tonnes</Text>
              <Text style={styles.impactTitle}>CO2 Saved</Text>
              <Text style={styles.impactDescription}>
                Installing solar helps reduction of emission of carbon-dioxide into atmosphere. This is the amount of CO2 saved by the solar plant over its lifetime.
              </Text>
            </View>

            <View style={[styles.impactCard, { backgroundColor: '#FF6B6B' }]}>
              <Icon name="tint" size={30} color="white" />
              <Text style={styles.impactValue}>{formatNumber(environmentalImpact.fuelSaved)}</Text>
              <Text style={styles.impactUnit}>litres</Text>
              <Text style={styles.impactTitle}>Fuel Saved</Text>
              <Text style={styles.impactDescription}>
                You are preventing burning of fuel by going solar instead of using conventional electricity sources. This is the average of all the fuel you will save.
              </Text>
            </View>

            <View style={[styles.impactCard, { backgroundColor: '#4CAF50' }]}>
              <Icon name="tree" size={30} color="white" />
              <Text style={styles.impactValue}>{formatNumber(environmentalImpact.treesEquivalent)}</Text>
              <Text style={styles.impactUnit}>trees</Text>
              <Text style={styles.impactTitle}>Trees Planted</Text>
              <Text style={styles.impactDescription}>
                Installing a solar power plant does much more carbon offset than a tree does by carbon absorption. By installing solar you are also planting trees.
              </Text>
            </View>

            <View style={[styles.impactCard, { backgroundColor: '#2196F3' }]}>
              <Icon name="car" size={30} color="white" />
              <Text style={styles.impactValue}>{formatNumber(environmentalImpact.carsEquivalent)}</Text>
              <Text style={styles.impactUnit}>cars</Text>
              <Text style={styles.impactTitle}>Cars Removed</Text>
              <Text style={styles.impactDescription}>
                If you go solar for all your electricity use you are taking more gasoline cars off road than buying a real single electric car, which further leads to low carbon emissions.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.navigate('Book A Call', { quoteData })}
            >
              <Text style={styles.buttonText}>Book a Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('Main')}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back to Home</Text>
            </TouchableOpacity>
          </View>

          {/* Info Tooltip */}
          <InfoTooltip
            visible={!!activeTooltip}
            onClose={() => setActiveTooltip(null)}
            title={activeTooltip ? tooltipData[activeTooltip].title : ''}
            message={activeTooltip ? tooltipData[activeTooltip].message : ''}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingTop: StatusBar.currentHeight,
  },
  iconback: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: '900',
    marginTop: 21,
    marginLeft: 30
  },
  title1: {
    fontSize: 25,
    color: 'white',
    marginLeft: 100,
    marginTop: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  white: {
    backgroundColor: '#ECEDFF',
    width: '100%',
    marginTop: '4%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0a117233',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a1172',
    marginLeft: 8,
  },
  cardContent: {
    flex: 1,

  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailRow: {
    marginBottom: 10,
    padding:10,
    flex: 1, // Ensure it takes full width
    borderBottomWidth: 1,
    borderBottomColor: '#D1FCFF',
  },
  detailLabel: {
    fontSize: 20,
    color: 'black',
    marginBottom: 4,
    marginTop:6
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0a1172',
    marginTop:5,
    marginLeft:10
  },
  systemSizeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a1172',
    textAlign:'center',
  },
  systemSizeUnit: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  circleContainer: {
    marginVertical: 20,
    marginTop: 40
  },
  circleText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#0a1172',
  },
  systemSizeLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  savingsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a1172',
  },
  savingsLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  barChart: {
    width: '100%',
    marginTop: 20,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 250,
    marginTop: 25
  },
  bar: {
    width: '20%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderRadius: 5,
  },
  beforeBar: {
    backgroundColor: '#0a1172',
    height: '100%',
  },
  afterBar: {
    backgroundColor: '#FFA500',
    height: '70%',
  },
  barLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0a1172',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#0a1172',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#0a1172',
  },
  fullWidthCard: {
    width: '100%',
    marginTop: 20,
  },
  graphLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  chart: {
    marginVertical: 15,
    borderRadius: 16,
    

  },
  impactContainer: {
    width: '100%',
    marginVertical: 20,
  },
  impactCard: {
    width: '100%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  impactUnit: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 5,
  },
  impactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
    marginBottom: 15,
  },
  impactDescription: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    backgroundColor: '#0D1A69',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  tooltipContent: {
    alignItems: 'center',
  },
  tooltipTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tooltipMessage: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
});

export default QuoteResult; 