/**
 * Resolutions module defines all supported resolutions,
 * If your particular monitor has a different resolution then the ones specified here,
 * please add your particular resolution and create a pull request after testing on your
 * hardware.
 */
export enum ResolutionType {
  'SVGA' = 'SVGA',
  'WSVGA' = 'WSVGA',
  'XGA' = 'XGA',
  'XGA+' = 'XGA+',
  'WXGA' = 'WXGA',
  'SXGA' = 'SXGA',
  'HD' = 'HD',
  'WXGA+' = 'WXGA+',
  'HD+' = 'HD+',
  'WSXGA+' = 'WSXGA+',
  'FHD' = 'FHD',
  'WUXGA' = 'WUXGA',
  'QHD' = 'QHD',
  'UWQHD' = 'UWQHD',
  '4K UHD' = '4K UHD',
}

export interface IResolutin {
  /**
   * Resolution type
   * has to be one of the supported ResolutionType's
   */
  type: ResolutionType;

  size: {
    /**
     * Weight of the screen
     */
    w: number;

    /**
     * Height of the screen
     */
    h: number;
  };

  /**
   * Horizontal collumns supported at specified resolution (minimum: 1)
   */
  columns: number;

  /**
   * Rows supported at specified resolution (minimum 1)
   */
  rows: number;
}

export type ResolutionsMap = {
  [a in ResolutionType]: IResolutin;
};

/* tslint:disable:object-literal-sort-keys */
export const Resolutions: ResolutionsMap = {
  /**
   * Resolutions map will enforce the number of collumns and rows supported at each resolution,
   * most adaptations will hapen here.
   *
   * Please keep the list aligned by size and don't forget to describe your expected rows and collumns for
   * new custom resolutions here.
   */
  'SVGA': { columns: 2, rows: 1, size: { h: 600, w: 800 }, type: ResolutionType.SVGA },
  'WSVGA': { columns: 2, rows: 1, size: { h: 600, w: 1024 }, type: ResolutionType.WSVGA },
  'XGA': { columns: 2, rows: 1, size: { h: 768, w: 1024 }, type: ResolutionType.XGA },
  'XGA+': { columns: 2, rows: 1, size: { h: 864, w: 1152 }, type: ResolutionType['XGA+'] },
  'WXGA': { columns: 2, rows: 1, size: { h: 800, w: 1280 }, type: ResolutionType.WXGA },
  'SXGA': { columns: 2, rows: 1, size: { h: 1024, w: 1280 }, type: ResolutionType.SXGA },
  'HD': { columns: 2, rows: 1, size: { h: 768, w: 1366 }, type: ResolutionType.HD },
  'WXGA+': { columns: 2, rows: 1, size: { h: 900, w: 1440 }, type: ResolutionType['WXGA+'] },
  'HD+': { columns: 2, rows: 1, size: { h: 900, w: 1600 }, type: ResolutionType['HD+'] },
  'WSXGA+': { columns: 2, rows: 1, size: { h: 1050, w: 1680 }, type: ResolutionType['WSXGA+'] },
  'FHD': { columns: 2, rows: 1, size: { h: 1080, w: 1920 }, type: ResolutionType.FHD },
  'WUXGA': { columns: 2, rows: 1, size: { h: 1200, w: 1920 }, type: ResolutionType.WUXGA },
  'QHD': { columns: 2, rows: 1, size: { h: 1440, w: 2560 }, type: ResolutionType.QHD },
  'UWQHD': { columns: 3, rows: 1, size: { h: 1440, w: 3440 }, type: ResolutionType.UWQHD },
  '4K UHD': { columns: 3, rows: 1, size: { h: 2160, w: 3840 }, type: ResolutionType['4K UHD'] },
};
/* tslint:enable:object-literal-sort-keys */
