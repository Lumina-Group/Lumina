import json
import unittest
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LUMINA_FOOTER_PAGES = (
    ROOT / "index.html",
    ROOT / "_layouts/default.html",
    ROOT / "pages/about.html",
    ROOT / "pages/mission.html",
    ROOT / "pages/news.html",
    ROOT / "pages/projects.html",
    ROOT / "pages/services.html",
)


class CardCopyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.card_copy = []
        self._capture = False
        self._text = []

    def handle_starttag(self, tag, attrs):
        if tag != "p":
            return
        classes = dict(attrs).get("class", "").split()
        if "ls-card-copy" in classes:
            self._capture = True
            self._text = []

    def handle_data(self, data):
        if self._capture:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag == "p" and self._capture:
            self.card_copy.append("".join(self._text).strip())
            self._capture = False
            self._text = []


class StorefrontContractTest(unittest.TestCase):
    def setUp(self):
        self.config = json.loads(
            (ROOT / "music/storefront-config.json").read_text(encoding="utf-8")
        )
        self.index = (ROOT / "music/index.html").read_text(encoding="utf-8")
        self.goods = (ROOT / "music/pages/goods.html").read_text(encoding="utf-8")
        self.script = (ROOT / "music/interaction.js").read_text(encoding="utf-8")
        self.navigation = (ROOT / "resource/js/modules/navigation.js").read_text(
            encoding="utf-8"
        )
        self.main_script = (ROOT / "resource/js/main.js").read_text(encoding="utf-8")
        self.redesign = (ROOT / "music/redesign.css").read_text(encoding="utf-8")

    def test_public_storefront_is_fail_closed(self):
        self.assertEqual(self.config["schemaVersion"], 1)
        self.assertEqual(self.config["portalOrigin"], "https://vinci.lumina-group.jp")
        self.assertTrue(self.config["features"])
        self.assertTrue(all(value is False for value in self.config["features"].values()))
        self.assertNotIn("data-store-action", self.index)
        self.assertNotIn('aria-disabled="true"', self.index)

    def test_routes_are_relative_and_cannot_redirect_to_another_origin(self):
        for route in self.config["routes"].values():
            self.assertTrue(route.startswith("/"))
            self.assertFalse(route.startswith("//"))
        self.assertIn("destination.origin !== allowedPortalOrigin", self.script)

    def test_storefront_points_to_official_site_without_checkout(self):
        self.assertIn('href="https://vinci.lumina-group.jp/"', self.index)
        self.assertNotIn("販売準備中", self.index)
        self.assertNotIn("登録準備中", self.index)

    def test_lumina_sounds_copy_is_not_personal_branding(self):
        self.assertIn("Luminaが運営する音楽ブランド", self.index)
        self.assertIn("Lumina Sounds is a music brand operated by Lumina.", self.index)
        for personal_wording in (
            "個人事業Lumina",
            "個人音楽ブランド",
            "私、「Lumina」",
            "personal music brand",
        ):
            self.assertNotIn(personal_wording, self.index)

    def test_lumina_site_footer_uses_lumina_sounds(self):
        for footer_page in LUMINA_FOOTER_PAGES:
            footer = footer_page.read_text(encoding="utf-8")
            self.assertIn("Lumina Sounds", footer, footer)
            self.assertNotIn("Lumina Music", footer, footer)

    def test_music_navigation_does_not_keep_multiple_underlines_active(self):
        self.assertIn("const currentHash = window.location.hash;", self.navigation)
        self.assertIn("if (linkUrl.hash)", self.navigation)
        self.assertIn("if (linkUrl.hash === currentHash)", self.navigation)
        self.assertIn("if (currentHash === '')", self.navigation)
        self.assertIn(
            "window.addEventListener('hashchange', setActiveNavLink);", self.main_script
        )
        self.assertIn(".ls-navbar .nav-item a.active::after", self.redesign)
        self.assertIn('.ls-navbar .nav-item a[aria-current="page"]::after', self.redesign)

    def test_product_cards_contain_only_approved_public_copy(self):
        parser = CardCopyParser()
        parser.feed(self.index)
        self.assertEqual(
            parser.card_copy,
            [
                "Vinciの公式サイトを公開しています。",
                "LUMINA SOUNDSの販売予定グッズを紹介しています。",
            ],
        )

    def test_goods_is_reachable_from_the_navigation_and_works(self):
        self.assertIn('<a href="/music/pages/goods.html">GOODS</a>', self.index)
        self.assertIn(
            'href="/music/pages/goods.html" class="ls-btn btn-buy">View Goods</a>',
            self.index,
        )

    def test_goods_page_is_a_text_only_pre_release_showcase(self):
        self.assertIn(
            '<link rel="canonical" href="https://lumina-group.jp/music/pages/goods.html">',
            self.goods,
        )
        self.assertIn('aria-current="page"', self.goods)
        self.assertIn('data-goods-product="metal-keyholder"', self.goods)
        self.assertIn('data-goods-product="towel"', self.goods)
        self.assertIn("Metal Keyholder", self.goods)
        self.assertIn("Towel", self.goods)
        self.assertIn(
            "LUMINA SOUNDSをかたどった、高級感のある金属製キーホルダー。",
            self.goods,
        )
        self.assertIn(
            "日々の時間と音楽のそばに置く、LUMINA SOUNDSのタオル。",
            self.goods,
        )
        self.assertIn("¥2,200", self.goods)
        self.assertIn("¥2,750", self.goods)
        self.assertIn("販売予定価格は、販売開始時に変更となる場合があります。", self.goods)
        self.assertGreaterEqual(self.goods.count("販売予定"), 3)
        self.assertGreaterEqual(self.goods.count("発売時期未定"), 3)

    def test_goods_page_does_not_expose_checkout_or_placeholder_content(self):
        goods_lower = self.goods.lower()
        self.assertNotIn("stripe", goods_lower)
        self.assertNotIn("buy.stripe.com", goods_lower)
        self.assertNotIn("data-store-action", self.goods)
        self.assertNotIn('aria-disabled="true"', self.goods)
        self.assertNotIn("<img", goods_lower)
        self.assertNotIn("image-placeholder", self.goods)


if __name__ == "__main__":
    unittest.main()
