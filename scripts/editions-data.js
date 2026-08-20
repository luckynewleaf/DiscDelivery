window.discDeliveryData = {
	shopifySubscriptionCheckout: {
		storeUrl: "",
		subscriptions: {
			"standard-monthly": { variantId: "", quantity: 1 },
			"club-monthly": { variantId: "", quantity: 1 }
		}
	},
	featuredEditionId: "edition-004",
	productEditions: {
		standard: {
			key: "standard",
			label: "Standard Edition",
			title: "Standard Edition",
			description: "The Standard Edition delivers this month's featured artist on signed CD, plus a collectible card tied to the exact Disc Delivery edition.",
			subscription: {
				planId: "standard-monthly",
				priceAmount: "\u20ac29.99",
				priceSuffix: "/ month",
				loyaltyUrl: "loyalty-system.html",
				ctaLabel: "Subscribe"
			},
			gallerySlides: [
				{ label: "Standard Edition Box", caption: "Standard Edition monthly box" },
				{ label: "Signed CD", caption: "Signed CD from this month's featured artist" },
				{ label: "Collectible Artist Card", caption: "Collectible card with artist + edition number" },
				{ label: "Standard Edition Contents", caption: "Complete Standard Edition layout" }
			],
			includedItems: [
				{
					id: "standard-curated-cd",
					name: "Curated CD",
					description: "Featuring 10 - 12 songs from various artists and unique artwork.",
					thumbSrc: "assets/cd_transparent.png",
					fullSrc: "assets/cd_transparent.png"
				},
				{
					id: "standard-postcard",
					name: "Postcard",
					description: "A thoughtful note written by Elliot, inspired by this month's edition.",
					thumbSrc: "assets/postcard_transparent.png",
					fullSrc: "assets/postcard_transparent.png"
				}
			]
		},
		club: {
			key: "club",
			label: "Club Edition",
			title: "Club Edition",
			description: "Club Edition includes everything in Standard Edition and adds a custom physical art print created only for that month's Disc Delivery release.",
			subscription: {
				planId: "club-monthly",
				priceAmount: "\u20ac39.99",
				priceSuffix: "/ month",
				loyaltyUrl: "loyalty-system.html",
				ctaLabel: "Subscribe"
			},
			gallerySlides: [
				{ label: "Club Edition Box", caption: "Club Edition monthly box" },
				{ label: "Signed CD", caption: "Signed CD from this month's featured artist" },
				{ label: "Collectible Artist Card", caption: "Collectible card with artist + edition number" },
				{ label: "Exclusive Art Print", caption: "Monthly Club Edition-only physical art print" }
			],
			includedItems: [
				{
					id: "club-curated-cd",
					name: "Curated CD",
					description: "Featuring 10 - 12 songs from various artists and unique artwork.",
					thumbSrc: "assets/cd_transparent.png",
					fullSrc: "assets/cd_transparent.png"
				},
				{
					id: "club-postcard",
					name: "Postcard (Your name, handwritten)",
					description: "A thoughtful note written by Elliot, inspired by this month's edition.",
					thumbSrc: "assets/postcard_transparent.png",
					fullSrc: "assets/postcard_transparent.png"
				},
				{
					id: "club-magazine",
					name: "DELIVERED - The Magazine",
					description: "This month's issue of the official Disc Delivery zine.",
					thumbSrc: "assets/magazine_transparent.png",
					fullSrc: "assets/magazine_transparent.png"
				}
			]
		}
	},
	membershipPlans: [],
	editions: [
		{ id: "edition-004", artistName: "Artist Placeholder 004", monthYear: "August 2026", editionCode: "Edition 004", albumTitle: "Album Placeholder 004", description: "Artist Placeholder 004 blends melodic experimentation with personal songwriting, balancing bold production with emotionally direct lyrics.", musicalIdentity: "Independent alternative artist with cinematic textures and understated vocals.", whySelected: "Selected for originality, strong identity, and a record that rewards repeat listens.", websiteUrl: "#", instagramUrl: "#", appleMusicUrl: "#", spotifyUrl: "#", portraitLabel: "Featured Artist Portrait", albumLabel: "Album Artwork", boxImages: ["Box Front", "Signed CD", "Insert Card"] },
		{ id: "edition-003", artistName: "Artist Placeholder 003", monthYear: "July 2026", editionCode: "Edition 003", albumTitle: "Album Placeholder 003", description: "Edition 003 features a rhythm-forward artist pairing inventive arrangements with intimate storytelling.", musicalIdentity: "Indie artist with warm analog production and sharp hooks.", whySelected: "Chosen for distinct songwriting voice and lasting replay value.", websiteUrl: "#", instagramUrl: "#", appleMusicUrl: "#", spotifyUrl: "#", portraitLabel: "Artist Portrait 003", albumLabel: "Album Artwork 003", boxImages: ["Edition Box 003", "Signed CD 003", "Artist Card 003"] },
		{ id: "edition-002", artistName: "Artist Placeholder 002", monthYear: "June 2026", editionCode: "Edition 002", albumTitle: "Album Placeholder 002", description: "Edition 002 highlights a genre-crossing artist focused on mood, detail, and careful sonic world-building.", musicalIdentity: "Independent artist merging electronic and acoustic elements.", whySelected: "Chosen for creative range and unmistakable artistic point of view.", websiteUrl: "#", instagramUrl: "#", appleMusicUrl: "#", spotifyUrl: "#", portraitLabel: "Artist Portrait 002", albumLabel: "Album Artwork 002", boxImages: ["Edition Box 002", "Signed CD 002", "Artist Card 002"] },
		{ id: "edition-001", artistName: "Artist Placeholder 001", monthYear: "May 2026", editionCode: "Edition 001", albumTitle: "Album Placeholder 001", description: "Our first edition introduced a distinctive songwriter with direct lyrics and wide-open arrangements.", musicalIdentity: "Emerging independent artist with folk-inflected alternative sound.", whySelected: "Chosen for songwriting depth and a debut record with strong emotional pull.", websiteUrl: "#", instagramUrl: "#", appleMusicUrl: "#", spotifyUrl: "#", portraitLabel: "Artist Portrait 001", albumLabel: "Album Artwork 001", boxImages: ["Edition Box 001", "Signed CD 001", "Artist Card 001"] }
	]
};
