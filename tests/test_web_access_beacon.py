import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class WebAccessBeaconContractTest(unittest.TestCase):
    def setUp(self):
        self.beacon = (ROOT / "resource/js/modules/web-access-beacon.js").read_text(
            encoding="utf-8"
        )
        self.main = (ROOT / "resource/js/main.js").read_text(encoding="utf-8")

    def test_public_beacon_is_opaque_and_contains_only_coarse_navigation_context(self):
        self.assertIn(
            'COLLECTOR_ENDPOINT = "https://vinci.lumina-group.jp/api/v1/web-access/beacon"',
            self.beacon,
        )
        self.assertIn('site: "lumina"', self.beacon)
        for field in ("page_path", "referrer_host", "viewport_bucket"):
            self.assertIn(field, self.beacon)
        for prohibited in (
            "document.cookie",
            "localStorage",
            "sessionStorage",
            "Authorization",
            "account_id",
            "access_token",
            "refresh_token",
            "navigator.userAgent",
        ):
            self.assertNotIn(prohibited, self.beacon)

    def test_cookie_can_only_travel_to_the_private_collector(self):
        self.assertIn('credentials: "include"', self.beacon)
        self.assertIn('mode: "cors"', self.beacon)
        self.assertIn('"Content-Type": "text/plain;charset=UTF-8"', self.beacon)
        self.assertNotIn("lumina-group.jp/api", self.beacon.replace("vinci.lumina-group.jp/api", ""))

    def test_beacon_is_loaded_by_the_shared_public_entrypoint(self):
        self.assertIn("./modules/web-access-beacon.js", self.main)
        self.assertIn("initWebAccessBeacon();", self.main)


if __name__ == "__main__":
    unittest.main()
