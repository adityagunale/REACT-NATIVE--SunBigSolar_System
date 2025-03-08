import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  Image,
  ScrollView,
  Animated
} from 'react-native';

const { width } = Dimensions.get('window');

const SimpleCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = new Animated.Value(0);

  const carouselItems = [
    { 
      image: require("../assets/solar-panel.webp"), 
      text: "Solar for Home" 
    },
    { 
      image: require("../assets/house3.webp"), 
      text: "Housing Society" 
    },
    { 
      image: require("../assets/zero.webp"), 
      text: "Zero Cost Solar" 
    },
    { 
      image: require("../assets/factory.webp"), 
      text: "Solar for Factory" 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the next index
      const nextIndex = (currentIndex + 1) % carouselItems.length;
      
      // Scroll to the next item
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * width,
          animated: true
        });
        
        setCurrentIndex(nextIndex);
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const scrollViewRef = React.useRef(null);

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {carouselItems.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
      >
        {carouselItems.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image 
                source={item.image} 
                style={styles.image} 
                resizeMode="cover"
              />
              <Text style={styles.cardText}>{item.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  card: {
    width: width - 40,
    backgroundColor: 'white',
    borderRadius: 15,
    borderTopRightRadius: 70,
    borderTopLeftRadius: 70,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,
  },
  image: {
    width: width - 80,
    height: 120,
    borderRadius: 10,
    marginTop: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '900',
    color: "#0C1767",
    marginTop: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#0C1767',
  },
  inactiveDot: {
    backgroundColor: '#C6EAFF',
  }
});

export default SimpleCarousel;