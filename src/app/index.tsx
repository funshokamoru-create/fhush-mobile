import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { supabase } from "../../lib/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

const productImages: Record<string, any> = {
  "Classic Office Two-Piece": require("../../assets/products/office-two-piece.jpg"),
  "Elegant Maxi Dress": require("../../assets/products/maxi-dress.jpg"),
  "Structured Blouse": require("../../assets/products/structured-blouse.jpg"),
  "Pleated Midi Skirt": require("../../assets/products/pleated-skirt.jpg"),
  "Modest Corporate Gown": require("../../assets/products/corporate-gown.jpg"),
  "Classic Ready-to-Wear Set": require("../../assets/products/ready-to-wear-set.jpg"),
};

const formatPrice = (price: number) =>
  `₦${Number(price).toLocaleString("en-NG")}`;

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  /*
   * HERO VIDEO
   */
  const player = useVideoPlayer(
    require("../../assets/hero.mp4")
  );

  useEffect(() => {
    player.loop = true;
    player.muted = true;

    const startVideo = async () => {
      try {
        await player.play();
      } catch (error) {
        console.log(
          "Hero video could not start:",
          error
        );
      }
    };

    startVideo();
  }, [player]);

  /*
   * LOAD PRODUCTS FROM SUPABASE
   */
  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, category")
        .order("id");

      if (error) {
        console.error(
          "Product loading error:",
          error
        );

        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const bestsellers = products.slice(0, 4);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* =====================================================
          ANNOUNCEMENT BAR
      ===================================================== */}

      <View style={styles.announcement}>
        <Text style={styles.announcementText}>
          FREE DELIVERY ON ORDERS OVER ₦100,000
        </Text>
      </View>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <View style={styles.header}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerLink}
            onPress={() => {}}
          >
            <Text style={styles.headerLinkText}>
              SHOP
            </Text>
          </Pressable>

          <Pressable
            style={styles.headerLink}
            onPress={() => {}}
          >
            <Text style={styles.headerLinkText}>
              SIGN IN
            </Text>
          </Pressable>

          <Pressable
            style={styles.bagButton}
            onPress={() => {}}
          >
            <Text style={styles.headerLinkText}>
              BAG
            </Text>

            <View style={styles.bagCircle}>
              <Text style={styles.bagCount}>
                0
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* =====================================================
          HERO
      ===================================================== */}

      <View style={styles.hero}>
        <VideoView
          player={player}
          style={styles.heroVideo}
          contentFit="cover"
          nativeControls={false}
        />

        <View style={styles.heroShade} />

        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>
            FHUSHDESIGNS
          </Text>

          <Text style={styles.heroTitle}>
            Modesty,
            {"\n"}
            beautifully defined.
          </Text>

          <Text style={styles.heroDescription}>
            Ready-to-wear pieces designed for
            confidence, elegance and everyday style.
          </Text>

          <Pressable
            style={styles.heroButton}
            onPress={() => {}}
          >
            <Text style={styles.heroButtonText}>
              SHOP THE COLLECTION
            </Text>
          </Pressable>
        </View>
      </View>

      {/* =====================================================
          BRAND INTRO
      ===================================================== */}

      <View style={styles.intro}>
        <Text style={styles.introTitle}>
          Wear Fhush.
        </Text>

        <Text style={styles.introGold}>
          Wear confidence.
        </Text>

        <Text style={styles.introText}>
          Thoughtfully designed modest fashion for
          women who want to look elegant, feel
          confident and move through every day
          beautifully.
        </Text>
      </View>

      {/* =====================================================
          COLLECTION
      ===================================================== */}

      <View style={styles.collection}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.eyebrow}>
              SHOP
            </Text>

            <Text style={styles.sectionTitle}>
              Our Collection
            </Text>
          </View>

          <Pressable onPress={() => {}}>
            <Text style={styles.viewAll}>
              VIEW ALL
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" />
          </View>
        ) : errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>
              Could not load products
            </Text>

            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>
            No products found.
          </Text>
        ) : (
          <View style={styles.productGrid}>
            {products.map((product) => (
              <View
                key={product.id}
                style={styles.productCard}
              >
                <Image
                  source={productImages[product.name]}
                  style={styles.productImage}
                  resizeMode="cover"
                />

                <Text style={styles.productCategory}>
                  {product.category}
                </Text>

                <Text style={styles.productName}>
                  {product.name}
                </Text>

                <Text style={styles.productPrice}>
                  {formatPrice(product.price)}
                </Text>

                {/* SHOP NOW */}
                <Pressable
                  style={styles.shopNowButton}
                  onPress={() => {}}
                >
                  <Text style={styles.shopNowText}>
                    SHOP NOW
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* =====================================================
          BESTSELLERS
      ===================================================== */}

      <View style={styles.bestsellers}>
        <Text style={styles.eyebrow}>
          FAVOURITES
        </Text>

        <Text style={styles.sectionTitle}>
          Bestsellers
        </Text>

        <Text style={styles.sectionDescription}>
          Pieces made to become part of your everyday
          wardrobe.
        </Text>

        {bestsellers.map((product) => (
          <View
            key={product.id}
            style={styles.bestsellerCard}
          >
            <Image
              source={productImages[product.name]}
              style={styles.bestsellerImage}
              resizeMode="cover"
            />

            <View style={styles.bestsellerInfo}>
              <Text style={styles.productCategory}>
                {product.category}
              </Text>

              <Text style={styles.bestsellerName}>
                {product.name}
              </Text>

              <Text style={styles.productPrice}>
                {formatPrice(product.price)}
              </Text>

              {/* SHOP NOW */}
              <Pressable
                style={styles.shopNowButton}
                onPress={() => {}}
              >
                <Text style={styles.shopNowText}>
                  SHOP NOW
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <View style={styles.story}>
        <Image
          source={require("../../assets/our-story.png")}
          style={styles.storyImage}
          resizeMode="cover"
        />

        <View style={styles.storyContent}>
          <Text style={styles.eyebrow}>
            OUR STORY
          </Text>

          <Text style={styles.storyTitle}>
            Modesty, with intention.
          </Text>

          <Text style={styles.storyText}>
            FhushDesigns was created for women who
            believe that modesty and modern style
            belong together.
          </Text>

          <Text style={styles.storyText}>
            Every piece is designed to make getting
            dressed feel effortless, elegant and
            confident.
          </Text>

          <Pressable
            style={styles.outlineButton}
            onPress={() => {}}
          >
            <Text style={styles.outlineButtonText}>
              DISCOVER FHUSH
            </Text>
          </Pressable>
        </View>
      </View>

      {/* =====================================================
          VALUES
      ===================================================== */}

      <View style={styles.values}>
        <Text style={styles.eyebrow}>
          THE FHUSH STANDARD
        </Text>

        <Text style={styles.valuesTitle}>
          Designed for how you live.
        </Text>

        <View style={styles.value}>
          <Text style={styles.valueNumber}>
            01
          </Text>

          <View style={styles.valueBody}>
            <Text style={styles.valueTitle}>
              Modesty
            </Text>

            <Text style={styles.valueText}>
              Elegant silhouettes created with
              coverage and confidence in mind.
            </Text>
          </View>
        </View>

        <View style={styles.value}>
          <Text style={styles.valueNumber}>
            02
          </Text>

          <View style={styles.valueBody}>
            <Text style={styles.valueTitle}>
              Quality
            </Text>

            <Text style={styles.valueText}>
              Thoughtful pieces made to become
              reliable wardrobe favourites.
            </Text>
          </View>
        </View>

        <View style={styles.value}>
          <Text style={styles.valueNumber}>
            03
          </Text>

          <View style={styles.valueBody}>
            <Text style={styles.valueTitle}>
              Confidence
            </Text>

            <Text style={styles.valueText}>
              Clothes that help you feel polished,
              comfortable and completely yourself.
            </Text>
          </View>
        </View>
      </View>

      {/* =====================================================
          NEWSLETTER
      ===================================================== */}

      <View style={styles.newsletter}>
        <Text style={styles.newsletterEyebrow}>
          STAY IN THE FHUSH
        </Text>

        <Text style={styles.newsletterTitle}>
          Be the first to know.
        </Text>

        <Text style={styles.newsletterText}>
          New collections, special pieces and Fhush
          updates — delivered occasionally.
        </Text>

        <Pressable
          style={styles.newsletterButton}
          onPress={() => {}}
        >
          <Text style={styles.newsletterButtonText}>
            JOIN THE LIST
          </Text>
        </Pressable>
      </View>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <View style={styles.footer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.footerLogo}
          resizeMode="contain"
        />

        <Text style={styles.footerTagline}>
          Wear Fhush. Wear confidence.
        </Text>

        <View style={styles.footerLinks}>
          <Pressable onPress={() => {}}>
            <Text style={styles.footerLink}>
              SHOP
            </Text>
          </Pressable>

          <Pressable onPress={() => {}}>
            <Text style={styles.footerLink}>
              OUR STORY
            </Text>
          </Pressable>

          <Pressable onPress={() => {}}>
            <Text style={styles.footerLink}>
              CONTACT
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footerCopyright}>
          © FhushDesigns. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  announcement: {
    height: 34,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  announcementText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1.2,
  },

  header: {
    minHeight: 82,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  logo: {
    width: 118,
    height: 44,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  headerLink: {
    minHeight: 40,
    justifyContent: "center",
  },

  headerLinkText: {
    color: "#111111",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.3,
  },

  bagButton: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  bagCircle: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#8a6a28",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },

  bagCount: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "700",
  },

  hero: {
    height: 620,
    width: "100%",
    backgroundColor: "#171717",
    position: "relative",
    overflow: "hidden",
  },

  heroVideo: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.30)",
  },

  heroContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 42,
  },

  heroEyebrow: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 15,
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "400",
    letterSpacing: -1,
  },

  heroDescription: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 18,
    maxWidth: 330,
  },

  heroButton: {
    marginTop: 26,
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    paddingHorizontal: 25,
    paddingVertical: 17,
  },

  heroButtonText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  intro: {
    paddingHorizontal: 24,
    paddingTop: 68,
    paddingBottom: 68,
    backgroundColor: "#ffffff",
  },

  introTitle: {
    color: "#111111",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "500",
  },

  introGold: {
    color: "#8a6a28",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "500",
  },

  introText: {
    marginTop: 22,
    color: "#555555",
    fontSize: 15,
    lineHeight: 25,
  },

  collection: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 65,
    backgroundColor: "#f8f7f4",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 25,
  },

  eyebrow: {
    color: "#8a6a28",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 9,
  },

  sectionTitle: {
    color: "#111111",
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "500",
  },

  viewAll: {
    color: "#111111",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  loadingBox: {
    paddingVertical: 80,
    alignItems: "center",
  },

  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  productCard: {
    width: "48%",
    marginBottom: 32,
  },

  productImage: {
    width: "100%",
    height: 245,
    backgroundColor: "#eeeeee",
    marginBottom: 12,
  },

  productCategory: {
    color: "#8a6a28",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  productName: {
    color: "#111111",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "500",
  },

  productPrice: {
    color: "#555555",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 7,
  },

  shopNowButton: {
    alignSelf: "flex-start",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#111111",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },

  shopNowText: {
    color: "#111111",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  bestsellers: {
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 65,
    backgroundColor: "#ffffff",
  },

  sectionDescription: {
    color: "#666666",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
    marginBottom: 28,
  },

  bestsellerCard: {
    marginBottom: 38,
  },

  bestsellerImage: {
    width: "100%",
    height: 410,
    backgroundColor: "#eeeeee",
  },

  bestsellerInfo: {
    paddingTop: 14,
  },

  bestsellerName: {
    color: "#111111",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "500",
  },

  story: {
    backgroundColor: "#f2eee7",
  },

  storyImage: {
    width: "100%",
    height: 430,
  },

  storyContent: {
    paddingHorizontal: 24,
    paddingVertical: 55,
  },

  storyTitle: {
    color: "#111111",
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "500",
  },

  storyText: {
    color: "#555555",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 18,
  },

  outlineButton: {
    alignSelf: "flex-start",
    marginTop: 27,
    borderWidth: 1,
    borderColor: "#111111",
    paddingHorizontal: 22,
    paddingVertical: 15,
  },

  outlineButtonText: {
    color: "#111111",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  values: {
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 65,
    backgroundColor: "#ffffff",
  },

  valuesTitle: {
    color: "#111111",
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "500",
    marginBottom: 38,
  },

  value: {
    flexDirection: "row",
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
  },

  valueNumber: {
    width: 45,
    color: "#8a6a28",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  valueBody: {
    flex: 1,
  },

  valueTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },

  valueText: {
    color: "#666666",
    fontSize: 13,
    lineHeight: 21,
  },

  newsletter: {
    paddingHorizontal: 24,
    paddingVertical: 65,
    backgroundColor: "#111111",
  },

  newsletterEyebrow: {
    color: "#c4a15a",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
  },

  newsletterTitle: {
    color: "#ffffff",
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "500",
    marginTop: 10,
  },

  newsletterText: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 16,
  },

  newsletterButton: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    marginTop: 25,
    paddingHorizontal: 23,
    paddingVertical: 16,
  },

  newsletterButtonText: {
    color: "#111111",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 35,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },

  footerLogo: {
    width: 125,
    height: 45,
  },

  footerTagline: {
    color: "#666666",
    fontSize: 12,
    marginTop: 8,
  },

  footerLinks: {
    flexDirection: "row",
    gap: 24,
    marginTop: 30,
  },

  footerLink: {
    color: "#111111",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.3,
  },

  footerCopyright: {
    color: "#999999",
    fontSize: 10,
    marginTop: 35,
  },

  errorBox: {
    paddingVertical: 30,
  },

  errorTitle: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 7,
  },

  errorText: {
    color: "#b00020",
    fontSize: 13,
    lineHeight: 20,
  },

  emptyText: {
    color: "#777777",
    fontSize: 14,
    paddingVertical: 30,
  },
});