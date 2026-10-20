// Captures app images for the Platform page. Needs Google Chrome, python3 (with the app repo's deps) and macOS qlmanage.
//   node tools/screenshots.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync, copyFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP_REPO = process.env.APP_REPO ?? join(process.env.HOME, 'code/nelladelva/projects/neuropenetrance_app');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const tmp = mkdtempSync(join(tmpdir(), 'np-shots-'));

// 1. live app start screen
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${join(tmp, 'profile')}`,
  '--window-size=1280,900', '--virtual-time-budget=120000', `--screenshot=${join(ROOT, 'assets/img/app-intake.png')}`,
  'https://neuropenetrance.streamlit.app/'], { stdio: 'ignore' });

// 2. the app's own PDF report for example profile B, rendered to PNG
const pdf = join(tmp, 'report.pdf');
execFileSync('python3', ['-c', `
import sys; sys.path.insert(0, ${JSON.stringify(APP_REPO)})
from model import *; from report import build_pdf
z = dict(zip(FEATURE_NAMES, [1.1, 0.9, 1.0, -0.8, -1.1, -0.9]))
s, c = score_profile(z); p, lo, hi = probability(s, 0.5); cat, cat_txt = category(s)
r = dict(report_id='PS-EXAMPLE', score=s, contrib=c, z=z, genes=FEATURE_NAMES, p=p, lo=lo, hi=hi, pretest=0.5,
         lr=likelihood_ratio(s), healthy_pct=healthy_percentile(s), patient_pct=patient_percentile(s), category=cat,
         interpretation='Example profile for illustration only (not patient data).')
open(${JSON.stringify(pdf)}, 'wb').write(build_pdf(r, {'patient_id': 'EXAMPLE-01', 'sample_id': 'S-01', 'collection_date': '2026-10-18'}, []))
`]);
execFileSync('qlmanage', ['-t', '-s', '1200', '-o', tmp, pdf], { stdio: 'ignore' });
const png = readdirSync(tmp).find((f) => f.endsWith('.pdf.png'));
copyFileSync(join(tmp, png), join(ROOT, 'assets/img/app-report.png'));
console.log('saved assets/img/app-intake.png and assets/img/app-report.png');
