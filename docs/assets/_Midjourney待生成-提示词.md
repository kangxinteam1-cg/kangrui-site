# 康瑞网站 · Midjourney 待生成图片 · 优化版提示词

> 已根据 `首页 hero / services-hero / area-01~04 / sub-04-standing` 等既有图的风格统一调校。
> 账号：`kangxingpt4@gmail.com`
> 网址：`https://www.midjourney.com/imagine`
> 输出路径：`docs/assets/images/`

---

## 风格 DNA（所有 prompt 共享的基底）

- **配色**：deep navy blue (#05152e) 主调 + warm brass / golden amber 暖光点缀，少量 teal undertones
- **时段**：dusk / twilight / late evening
- **光源**：cinematic side light、single dramatic shaft、brass desk lamp glow
- **材质**：polished navy marble、brass、aged leather、glass curtain wall、carved stone columns
- **镜头感**：cinematic editorial photography, premium magazine cover style, shallow depth of field
- **统一负面**：no people, no text, no watermark, no logos
- **共享后缀**：`--style raw --v 6.1 --quality 2`

---

## 1. `news-hero.png` · 新闻资讯页 hero（16:9）

```
wide cinematic photograph of a modern law firm press briefing room at late dusk, deep navy blue marble walls with subtle brass inlay trim, long polished dark walnut conference table reflecting warm amber light, stacked Chinese legal journals and folded newspapers on the surface, single brass banker lamp glowing on one side, faint blue twilight seeping through tall arched windows in the back, empty room, minimalist editorial mood, premium magazine cover style, cinematic side lighting, shallow depth of field, no people, no text, no logos --ar 16:9 --style raw --v 6.1 --quality 2
```

## 2. `insights-hero.png` · 康瑞洞察页 hero（16:9）

```
wide cinematic photograph of a quiet executive study at dusk, deep navy walls with bookshelves of leather-bound legal volumes, dark tufted leather high-back chair, large mahogany desk with open notebook and fountain pen, single brass desk lamp casting warm amber pool of light, faint blue light from a tall window overlooking a softly lit Beijing skyline at twilight, golden hour ambience, contemplative mood, editorial photography, cinematic shallow depth of field, no people, no text --ar 16:9 --style raw --v 6.1 --quality 2
```

## 3. `contact-hero.png` · 联系我们页 hero（16:9）

```
sweeping cinematic interior of a high-end Beijing law firm reception lobby at dusk, polished navy marble floor mirroring the scene, towering classical stone columns with brass capitals, navy walls with subtle brass inlay, large arched window in the back glowing with deep blue twilight, single warm pendant lamp illuminating the central reception desk, a faint Chinese ink painting visible on a side wall, minimalist editorial style, grand symmetric composition, cinematic side light, no people, no text, no logos --ar 16:9 --style raw --v 6.1 --quality 2
```

## 4. `news-featured.png` · 新闻头条配图（16:10）

```
abstract architectural low-angle photograph of grand classical stone columns of a Chinese Supreme Court style building, navy twilight sky with subtle warm golden glow on the column edges, dramatic golden-hour rim light, deep shadow gradient, refined editorial style, monumental and minimalist, cinematic, no people, no text --ar 16:10 --style raw --v 6.1 --quality 2
```

## 5. `insights-featured.png` · 洞察主编荐读封面（7:5）

```
macro close-up of a polished brass fountain pen nib writing on cream textured paper, glossy black ink stroke, deep navy blurred backdrop with a hint of brass desk lamp glow, side raking light, shallow depth of field, magazine editorial photography, intimate and contemplative, no text, no watermark --ar 7:5 --style raw --v 6.1 --quality 2
```

## 6. `insights-pick-2.png` · 洞察副推 cream 卡（4:3）

```
top-down editorial flat lay of an opened antique legal book with handwritten margin annotations in fountain pen ink, brass magnifying glass resting on the page, vintage brass paperweight, cream and warm beige color palette, soft natural side window light, gentle shadows, premium magazine flat lay photography, no text, no watermark --ar 4:3 --style raw --v 6.1 --quality 2
```

## 7. `insights-pick-3.png` · 洞察副推 teal 卡（4:3）

```
abstract macro photograph of intertwined copper and brass wires forming an elegant knot, set against a deep teal-to-navy gradient background, single warm rim light catching the metal edges, premium studio lighting, symbolic of intellectual property and connection, editorial product photography, shallow depth of field, no text, no watermark --ar 4:3 --style raw --v 6.1 --quality 2
```

## 8. `team-hero.png` · 律师团队页 hero（16:9）

```
wide cinematic photograph of an empty modern law firm boardroom at dusk, long polished dark walnut conference table with a row of dark tufted leather chairs evenly arranged, deep navy blue marble walls with subtle brass inlay trim, faint blue twilight light through tall arched windows in the back, single brass pendant lamp glowing warm amber over the table center, stacks of legal volumes and a closed notebook on the table, minimalist editorial mood, grand symmetric composition, premium magazine cover style, cinematic side lighting, shallow depth of field, no people, no text, no logos --ar 16:9 --style raw --v 6.1 --quality 2
```

## 9. `visit-map.png` · 联系页地图区背景图（16:9，约 1600×900）

> **用途**：contact.html 的 visit 区,容器 min-height 540px,会被 object-fit:cover 填满。
> 上面会叠加一个红色 pin + 白色"康瑞 · 盈都大厦A座"标签(代码已写好),所以**画面正中央留一点空白**很重要。
> 点击图片仍跳转高德实时地图,这张图只承担"品牌氛围"职责,不需要真实街道。

### 推荐版（首选生成这条）

```
high-altitude aerial cinematic photograph of Beijing Haidian district business area at deep blue twilight, sweeping bird's-eye view from above looking down on a quiet web of softly lit boulevards and modern office towers, deep navy blue dominant tone covering 70% of the frame, scattered warm brass-amber street lights and faint window glows tracing the avenues like golden veins, distant Western Hills silhouette barely visible in the haze on the horizon, subtle drifting evening mist softening the city, no neon, no signage, no chinese characters, no logos, no people, no cars in detail, minimalist editorial mood, premium magazine cover style, cinematic atmospheric lighting, shallow depth of field, calm contemplative tone, slight central negative space for composition --ar 16:9 --style raw --v 6.1 --quality 2
```

### 备选 A · 更近景，街道纹理感

```
elevated cinematic photograph of a quiet north Beijing avenue at dusk seen from a high office tower, deep navy blue ambient sky and shadow base tone, two parallel lanes lined with elegant late-twentieth-century office buildings in muted tones, warm brass amber streetlamps casting pools of light along the avenue, faint reflection of warm light on wet pavement after light rain, distant city silhouette fading into a misty navy gradient, no neon, no signage, no chinese characters, no people, no logos, central composition with calm negative space, minimalist editorial mood, premium magazine cover style, cinematic side lighting, shallow depth of field --ar 16:9 --style raw --v 6.1 --quality 2
```

### 备选 B · 抽象坐标感（最装饰化）

```
abstract aerial cinematic composition of a city grid at twilight, deep navy blue base, fine warm brass-amber lines tracing avenues and intersections like an elegant minimalist circuitry, subtle glow at one central intersection drawing the eye, soft drifting evening mist over the lower edges, distant constellation of faint amber pinpoints suggesting buildings, very minimal and refined, premium architectural editorial style, generous central negative space, no neon, no signage, no text, no chinese characters, no people, no logos, cinematic atmospheric lighting, shallow depth of field --ar 16:9 --style raw --v 6.1 --quality 2
```

### 挑图标准（针对 visit-map 单独）

- **画面正中央留干净区域**：让红色 pin + 白色"康瑞 · 盈都大厦A座"文字标签能落上去清晰可读
- **不要出现任何文字 / 路牌 / 招牌 / 汉字**：MJ 会乱写假字，干扰品牌
- 深蓝面积 ≥ 70%，暖光集中在街道纹路或几处亮点，不要全屏铺暖
- 不要太花哨的霓虹 / 赛博朋克风（首页 hero 已是那种调，这里需要更内敛）
- 透视优先级：俯瞰（推荐版）> 写字楼高处往街道（备选 A）> 抽象坐标（备选 B）

---

## Midjourney 操作流程（每条 prompt）

1. 登录 https://www.midjourney.com/imagine（账号 `kangxingpt4@gmail.com`）
2. 把上面整段 prompt 粘到输入框 → 回车提交
3. 等约 60-90 秒生成 4 格 variation
4. 挑画面最稳的那张点击 → `Upscale (Subtle)` 放大到单张高清
5. Upscale 完成后 → 右键另存 / Download → 重命名为对应文件名
6. 保存到 `docs/assets/images/` 即可

## Claude 推荐的挑选标准（与既有图保持一致）

- 主体居中或对称构图优先（参考 area-03-hero、services-hero 的中轴线感）
- 暖光要"集中点亮"而非全屏铺暖（参考 sub-04-standing 的台灯感）
- navy 占整体画面 60% 以上，保证全站视觉统一
- 避开过度赛博朋克的霓虹风（首页 hero 已有，其他页不要重复）
- 避开任何隐约出现的文字/logo/水印
