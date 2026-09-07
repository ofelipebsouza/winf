#!/bin/bash
# Lighthouse sweep — full categories on key pages, 3-cat (no perf) on the rest
export CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
FLAGS="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --window-size=1350,940 --mute-audio"
mkdir -p .freebuff/lh
run() { # url name full(1/0)
  local url="http://localhost:4173$1" name="$2"
  local cats="performance,accessibility,best-practices,seo"
  if [ "$3" != "1" ]; then cats="accessibility,best-practices,seo"; fi
  timeout 200 npx --yes lighthouse@11 "$url" --output=json --output-path=".freebuff/lh/$name.json" --quiet --chrome-flags="$FLAGS" --only-categories=$cats --max-wait-for-load=60000 > /dev/null 2>&1
  node -e "
    try {
      const r = require('./.freebuff/lh/$name.json');
      if (r.runtimeError) { console.log('$name RUNTIME_ERROR ' + r.runtimeError.code); process.exit(0); }
      const o = [];
      for (const c of ['performance','accessibility','best-practices','seo']) {
        const s = r.categories[c];
        if (s) o.push(c.slice(0,4) + '=' + Math.round((s.score || 0) * 100));
      }
      console.log('$name', o.join(' '));
    } catch (e) { console.log('$name MISSING'); }
  "
}
run /invisible invisible 1
run /securityblind securityblind 1
run /shop shop 1
run /blog blog 1
run /aerocore aerocore 0
run /neoskin neoskin 0
run /ceramic ceramic 0
run /dual-reflect dualreflect 0
run /blackpro blackpro 0
run /miniblind-venetian miniblind 0
run /winf-home winfhome 0
run /aerocore/ghost ghost 0
run /neoskin/bunker bunker 0
echo SWEEP_DONE
