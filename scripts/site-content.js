(function () {
	const standardFaq = [
		["How does the Disc Delivery Club work?", "You subscribe, we reveal the monthly artist before deadline, and we ship your mystery album edition after the window closes."],
		["When is the artist revealed?", "About one week before the monthly subscription deadline."],
		["When do I find out which album I’m receiving?", "The specific album remains a mystery until your box arrives."],
		["When does my box ship?", "Shortly after the monthly subscription deadline closes."],
		["Can I skip a month?", "Yes. Members can skip a month without cancelling their membership."],
		["Can I cancel my membership?", "Yes. Cancel before your next billing cycle to stop renewal."],
		["Where do you ship?", "Shipping regions and rates are shown clearly at checkout."],
		["What happens if my CD arrives damaged?", "If the CD itself is damaged, we first offer a replacement and a discount code for your next box. If replacement stock is unavailable, you receive a full refund for that box and can keep the damaged one. This policy applies to CD and product damage, not cosmetic shipping-box wear."],
		["What if I already own the album?", "Contact us and we will try to help with an alternative when available."],
		["Are the CDs signed?", "Yes, signed copies are included whenever available through the artist."]
	];

	const months = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", "Month 7", "Month 8", "Month 9", "Month 10", "Month 11", "Month 12+"];
	const prices = function (start) {
		return months.map(function (month, index) {
			return [month, "€" + (start - index).toFixed(2)];
		});
	};

	window.siteContent = {
		common: {
			brand: "Disc Delivery",
			navigation: ["Join The Club", "Shop", "About", "Contact", "Account"],
			privacy: "Privacy Policy",
			terms: "Terms of Service",
			copyright: "© 2026 Disc Delivery",
			images: {
				logo: { src: "assets/DiscDelivery_Logo_White.png", alt: "Disc Delivery" }
			}
		},
		pages: {
			home: {
				title: "Disc Delivery",
				heading: "Good music. Delivered.",
				heroAlt: "Placeholder space for the Disc Delivery hero video",
				joinLink: "Join the club"
			},
			joinClub: {
				title: "Join The Club",
				editionTabs: ["STANDARD EDITION", "CLUB EDITION"],
				includedHeading: "Included",
				loyalty: "Pay less each month you’re subscribed.",
				loyaltyLink: "Read More.",
				faq: standardFaq,
				folderTabs: ["How It Works", "Who Do We Choose?", "This Month’s Artist", "Recent Editions"],
				howItWorks: [
					["01 - Join The Club", "Choose your monthly recurring Disc Delivery subscription and start building loyalty savings over time."],
					["02 - Artist Reveal", "We reveal the featured artist about a week before the deadline. The exact album stays hidden until your box is in your hands."],
					["03 - Press Play", "Your signed CD arrives with an art card and a members-only email going deeper into the artist’s story and process."]
				],
				whoDoWeChoose: [
					"Disc Delivery focuses on independent and emerging artists with strong identity, inventive music, and real creative perspective. We look for artists with something distinct to say - people we believe deserve wider audiences.",
					"They do not need to be unknown. The key idea is new-to-you: records and voices you have not found yet, but might end up loving.",
					"We also look for artists with a clear visual language and physical release mindset. The projects that work best in Disc Delivery are the ones where artwork, sequencing, and format all feel intentional.",
					"Every pick is curated with long-term collectability in mind, not just trend momentum.",
					"We do not feature artists who create AI-generated or AI-assisted music."
				],
				featuredArtistButton: "Click to reveal this month’s artist.",
				recentEditions: "Recent Editions",
				viewPastEditions: "View all past editions"
			},
			shop: { title: "Shop", cart: "In Your Cart", categories: ["Past Editions", "Apparel", "Small Goods"], cartTitle: "Your Cart", emptyCart: "Your cart is empty.", total: "Total", checkout: "Checkout" },
			about: {
				title: "About Me", name: "Hi, I’m Elliot Beck", founderAlt: "Founder portrait placeholder", founderPlaceholder: "Portrait placeholder for Elliot Beck.",
				intro: ["I’ve always been drawn to music that feels physical. I like sleeves, liner notes, inserts, and the feeling that a release has a life outside a streaming tab.", "Disc Delivery started from that instinct. I wanted to build something that made discovering music feel a little more personal and a little more collectible, while still giving independent artists a thoughtful way to reach new listeners.", "I come to this from a place of curiosity, design, and genuine love for records that stay with you. I wanted Disc Delivery to feel editorial and carefully art-directed, but still warm and human.", "It’s a small project by design. I want every edition to feel considered, memorable, and worth keeping."],
				whyTitle: "Why I Started Disc Delivery",
				why: ["I wanted to make discovery feel exciting again. A lot of music lives online now, but I missed the feeling of finding an artist in a way that gave the release weight, context, and something to hold onto.", "Disc Delivery is my answer to that. It is a small, curated club built around physical releases, where the packaging matters, the presentation matters, and the music is introduced with a little more care than a fast-moving feed usually allows.", "I wanted every edition to feel like an object that could sit on a shelf and still carry a memory later. The goal is not just to send out records. It is to shape a moment around them.", "That means slowing things down, paying attention to the visuals, and treating each artist as the center of a tiny release ecosystem. I want the club to feel intimate, specific, and worth keeping.", "Disc Delivery is also a way to support artists whose work already feels thought-through and ready for a physical format. I like the idea of giving that work a home outside the usual streaming-first path."],
				backersTitle: "Kickstarter Backers", backersIntro: "Thank you for making Disc Delivery possible.", backers: ["Alex Morgan", "Sophie Bennett", "Daniel Carter", "Mia Thompson", "Jordan Ellis", "Hannah Cooper", "Liam Foster", "Grace Mitchell", "Noah Reynolds", "Olivia Hayes", "Ethan Brooks", "Ava Turner", "Caleb Bennett", "Chloe Parker", "Leo Simmons", "Ruby Carter", "Mason Reed", "Isla Morgan", "Nora Bennett", "Owen Price", "Sadie Collins", "Jasper Lane", "Ella Walker", "Henry Lawson"]
			},
			contact: { title: "Contact Us", customerCare: "Customer Care: customercare@discdelivery.com", business: "Press & Business Inquiries: business@discdelivery.com", artists: "For artists: apply@discdelivery.com", artistButton: "Artist Requirements", dialogTitle: "Artist requirements", dialogIntro: "We are looking for artists who are already signed to a label and who either have CD stock or can produce it. We do not have the capability to manufacture CDs ourselves.", dialogListTitle: "Please include:", dialogItems: ["Real name", "Stage name", "Birthdate", "Label you are signed to", "Country", "Links or usernames for your primary social media, like TikTok and Instagram", "Your official website, if you have one"] },
			pastEditions: { title: "Past Editions", archiveLabel: "Disc Delivery artist archive" },
			included: {
				title: "What’s Included In Each Box",
				items: [
					{ id: "curated-cd", title: "Curated CD", image: { src: "assets/cd_transparent.png", alt: "Curated CD" }, paragraphs: ["Every Disc Delivery box includes one curated CD built around this month’s featured artist and visual world. Each disc typically contains 10 - 12 tracks and is sequenced to feel like a complete listening experience from start to finish.", "We treat the physical presentation as part of the release itself. Artwork is custom-designed for each edition so the disc, printed details, and packaging all feel intentionally connected to that specific month and artist."] },
					{ id: "postcard", title: "Postcard", image: { src: "assets/postcard_transparent.png", alt: "Postcard" }, paragraphs: ["Each delivery also includes a postcard with a short note from Elliot tied to the edition and artist of the month. It is designed to add context, tone, and a personal layer to the listening experience.", "The postcard is meant to feel like part of a collectible set, so its design direction changes month to month while still fitting the overall Disc Delivery identity."], note: "If you choose the Club Edition, your first name (from your order) is handwritten by Elliot on your postcard." },
					{ id: "magazine", title: "DELIVERED - The Magazine", image: { src: "assets/magazine_transparent.png", alt: "DELIVERED - The Magazine" }, exclusive: "Club Edition Exclusive", paragraphs: ["DELIVERED is the monthly Disc Delivery zine included in Club Edition boxes. It expands on the artist reveal with additional context, visuals, and behind-the-scenes editorial details that go deeper than the standard insert materials.", "Each issue is developed to match the tone of that month’s release, giving Club members a richer collectible layer that sits alongside the music and physical artwork."] }
				]
			},
			loyalty: { title: "Loyalty System", paragraphs: ["Every Disc Delivery subscription starts at its standard monthly price. For every month you remain subscribed, your monthly price decreases by €1. This rewards members for staying with Disc Delivery longer and means the longer you stay, the less you pay.", "Your Loyalty Price is based on how many consecutive months you have been subscribed. If you cancel your subscription at any point, your accumulated Loyalty Price and savings are reset. If you subscribe again in the future, you start again at the standard monthly price.", "The Loyalty System is capped at 12 months. After reaching the 12-month price, that price remains your monthly price for as long as you remain subscribed."], note: "The price shown for each month below is the price paid for that month’s delivery. After month 12, the month 12+ price becomes your ongoing monthly price while your subscription remains active.", tables: [{ title: "Standard Edition", rows: prices(29.99) }, { title: "Club Edition", rows: prices(39.99) }] },
			privacy: { title: "Privacy Policy", paragraphs: ["This placeholder policy page explains how Disc Delivery handles account details, order data, and contact information.", "We only store data needed to process memberships, orders, and support requests, and we never sell your personal information.", "For policy requests, contact customercare@notreallystrangers.com."] },
			terms: { title: "Terms of Service", paragraphs: ["This placeholder terms page outlines the rules for memberships, shop purchases, and the Disc Delivery website.", "By using the site, customers agree to payment, shipping, and cancellation terms presented at checkout.", "For legal questions, contact info@notreallystrangers.com."] }
		},
		images: {}
	};
})();