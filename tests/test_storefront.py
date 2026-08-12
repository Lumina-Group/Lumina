import json
import unittest
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


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
        self.script = (ROOT / "music/interaction.js").read_text(encoding="utf-8")

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

    def test_product_cards_contain_only_approved_public_copy(self):
        parser = CardCopyParser()
        parser.feed(self.index)
        self.assertEqual(
            parser.card_copy,
            [
                "Vinciの公式サイトを公開しています。",
            ],
        )


if __name__ == "__main__":
    unittest.main()
