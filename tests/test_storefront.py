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
        self.assertEqual(self.index.count('aria-disabled="true"'), 2)

    def test_routes_are_relative_and_cannot_redirect_to_another_origin(self):
        for route in self.config["routes"].values():
            self.assertTrue(route.startswith("/"))
            self.assertFalse(route.startswith("//"))
        self.assertIn("destination.origin !== allowedPortalOrigin", self.script)

    def test_storefront_discloses_offline_renewal_and_closed_checkout(self):
        self.assertIn("30日ごとのオンライン更新と7日間の猶予", self.index)
        self.assertIn("Freeは1台・1GB、Proは最大3台・20GB", self.index)
        self.assertIn("製品仕様、価格、販売時期などの詳細はまだ公開していません", self.index)
        self.assertIn('href="https://vinci.lumina-group.jp/"', self.index)

    def test_product_cards_contain_only_approved_public_copy(self):
        parser = CardCopyParser()
        parser.feed(self.index)
        self.assertEqual(
            parser.card_copy,
            [
                "Vinciの公式サイトを公開しています。",
                "公式追加コンテンツは個別購入です。購入権はアカウントに残り、端末利用には30日ごとのオンライン更新と7日間の猶予があります。",
                "Freeは1台・1GB、Proは最大3台・20GB。Proに無料試用期間はありません。",
            ],
        )


if __name__ == "__main__":
    unittest.main()
